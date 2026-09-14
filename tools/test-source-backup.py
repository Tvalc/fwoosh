"""Verify source recovery and refusal to overwrite or trust tampered archives."""
from pathlib import Path
import importlib.util
import json
import shutil
import uuid
import unittest
import zipfile

spec=importlib.util.spec_from_file_location('source_backup',Path(__file__).with_name('source-backup.py'))
backup=importlib.util.module_from_spec(spec)
spec.loader.exec_module(backup)

class BackupTests(unittest.TestCase):
    def setUp(self):
        temp_root=(Path(__file__).resolve().parent.parent/'work'/'backup-tests').resolve()
        temp_root.mkdir(parents=True,exist_ok=True)
        self.base=(temp_root/uuid.uuid4().hex).resolve()
        if not self.base.is_relative_to(temp_root):
            raise RuntimeError('Temporary cleanup path escaped the test workspace')
        self.base.mkdir()
        self.addCleanup(lambda: shutil.rmtree(self.base))
        self.game=self.base/'game'
        (self.game/'assets'/'raw').mkdir(parents=True)
        (self.game/'index.html').write_text('<canvas></canvas>')
        (self.game/'assets'/'raw'/'original.png').write_bytes(b'original source bytes')
        (self.game/'.gitignore').write_text('assets/\n')

    def test_ignored_original_restores_exactly_after_source_changes(self):
        archive, _=backup.create(self.game,self.base/'backups')
        (self.game/'assets'/'raw'/'original.png').write_bytes(b'new variant')
        restored=self.base/'restored'
        backup.restore(archive,restored)
        self.assertEqual((restored/'assets'/'raw'/'original.png').read_bytes(),b'original source bytes')
        self.assertEqual((restored/'index.html').read_text(),'<canvas></canvas>')

    def test_existing_restore_directory_is_never_overwritten(self):
        archive,_=backup.create(self.game,self.base/'backups')
        with self.assertRaisesRegex(ValueError,'already exists'):
            backup.restore(archive,self.game)
        self.assertEqual((self.game/'assets'/'raw'/'original.png').read_bytes(),b'original source bytes')

    def test_tampering_is_rejected_before_destination_created(self):
        archive,_=backup.create(self.game,self.base/'backups')
        bad=self.base/'tampered.zip'
        with zipfile.ZipFile(archive) as source, zipfile.ZipFile(bad,'w') as target:
            for name in source.namelist():
                target.writestr(name,b'tampered' if name=='index.html' else source.read(name))
        restored=self.base/'rejected'
        with self.assertRaisesRegex(ValueError,'Integrity check failed'):
            backup.restore(bad,restored)
        self.assertFalse(restored.exists())

    def test_parent_path_is_rejected(self):
        bad=self.base/'path.zip'
        data=b'outside'
        with zipfile.ZipFile(bad,'w') as target:
            target.writestr('../outside.txt',data)
            target.writestr('MANIFEST.json',json.dumps({'version':1,'files':[
                {'path':'../outside.txt','bytes':len(data),'sha256':backup.sha(data)}]}))
        with self.assertRaisesRegex(ValueError,'Unsafe archive path'):
            backup.restore(bad,self.base/'rejected')
        self.assertFalse((self.base/'outside.txt').exists())

    def test_backup_cannot_recurse_into_its_own_source(self):
        with self.assertRaisesRegex(ValueError,'outside the game'):
            backup.create(self.game,self.game/'backups')
        self.assertFalse((self.game/'backups').exists())

if __name__=='__main__':
    unittest.main()

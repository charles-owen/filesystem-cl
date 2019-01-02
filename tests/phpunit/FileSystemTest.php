<?php
/** @file
 * @brief Unit tests for the class FileSystem
 * @cond 
 */
require_once __DIR__ . '/init.php';
require_once __DIR__ . '/cls/FileSystemDatabaseTestBase.php';

use CL\Users\Users;
use CL\Users\User;
use CL\FileSystem\FileSystem;


class FileSystemTest extends FileSystemDatabaseTestBase
{
	/**
	 * @return PHPUnit_Extensions_Database_DataSet_IDataSet
	 */
	public function getDataSet() {
		return $this->dataSets(['filesystem.xml', 'user-many.xml']);
	}

	public function ensureTables() {
		$this->ensureTable(new Users($this->site->db));
		$this->ensureTable(new FileSystem($this->site->db));
	}



	public function test_read_text() {
		$fs = new FileSystem($this->site->db);

		$this->assertInstanceOf('\CL\FileSystem\FileSystem', $fs);

		$users = new Users($this->site->db);
		$user = $users->get(5);
		$json = '{"grid":8,"snap":true,"circuits":[{"name":"main","width":1920,"height":1080,"components":[{"id":"c1001","x":112,"y":256,"name":"C1","type":"Clock","freq":2000000,"period":0.359},{"id":"c1002","x":288,"y":256,"name":"L1","type":"LED","color":"blue"},{"id":"c1003","x":208,"y":176,"name":null,"type":"Inverter"},{"id":"c1004","x":288,"y":176,"name":"L2","type":"LED","color":"blue"},{"id":"c1005","x":224,"y":344,"name":null,"type":"And"},{"id":"c1006","x":336,"y":344,"name":"L3","type":"LED","color":"blue"},{"id":"c1007","x":104,"y":360,"name":null,"type":"Button"}],"connections":[{"from":"c1001","out":0,"to":"c1002","in":0,"bends":[]},{"from":"c1001","out":0,"to":"c1003","in":0,"bends":[{"x":160,"y":256},{"x":160,"y":176}]},{"from":"c1001","out":0,"to":"c1005","in":0,"bends":[{"x":176,"y":256}]},{"from":"c1003","out":0,"to":"c1004","in":0,"bends":[]},{"from":"c1005","out":0,"to":"c1006","in":0,"bends":[]},{"from":"c1007","out":0,"to":"c1005","in":1,"bends":[]}]}]}';

		$time = time();
		$id = $fs->writeText($user->id, 0,"cirsim",
			"example file", $json, "application/json", FileSystem::PERMISSION_PRIVATE, $time);
		$this->assertTrue($id !== false);

		$ret = $fs->readTextId($id);
		$this->assertNotNull($ret);
		$this->assertEquals($json, $ret["data"]);
		$this->assertEquals("application/json", $ret["type"]);
		$this->assertEquals($time, $ret["created"]);
		$this->assertEquals($time, $ret["modified"]);
		$this->assertEquals(FileSystem::PERMISSION_PRIVATE, $ret["permission"]);

		$ret = $fs->readText($user->id, 0,"cirsim", "example file");
		$this->assertNotNull($ret);
		$this->assertEquals($json, $ret["data"]);
		$this->assertEquals("application/json", $ret["type"]);
		$this->assertEquals($time, $ret["created"]);
		$this->assertEquals($time, $ret["modified"]);

		$ret = $fs->readText($user->id, "", "cirsim", "not a file");
		$this->assertNull($ret);

		// This write should fail (duplicate)
		$ret = $fs->writeText($user->id, 0,"cirsim", "example file", $json, "application/json", FileSystem::PERMISSION_PRIVATE, $time);
		$this->assertFalse($ret);

		$this->assertTrue($fs->fileExists($user->id, 0,"cirsim", "example file"));
		$this->assertFalse($fs->fileExists($user->id, 0,"cirsim", "not a file"));

		$json2 = "fdafdsafdsafds";
		$ret = $fs->updateText($user->id,  0,"cirsim", "example file", $json2, "application/json", FileSystem::PERMISSION_PRIVATE, $time + 100);
		$this->assertTrue($ret);

		$ret = $fs->readText($user->id, 0,"cirsim", "example file");
		$this->assertNotNull($ret);
		$this->assertEquals($json2, $ret["data"]);
		$this->assertEquals("application/json", $ret["type"]);
		$this->assertEquals($time, $ret["created"]);
		$this->assertEquals($time + 100, $ret["modified"]);
	}

	public function test_query() {
		$fs = new FileSystem($this->site->db);

        $users = new Users($this->site->db);
        $user3 = $users->get(3);
        $user5 = $users->get(5);

        $time = time();
        $id1 = $fs->writeText($user3->id, 0,"whatever", "quiz1", "User 3 Quiz 1", "text/plain", FileSystem::PERMISSION_PRIVATE, $time);
        $fs->writeText($user5->id, 0,"whatever", "quiz1", "User 5 Quiz 1 ", "text/plain", FileSystem::PERMISSION_PRIVATE, $time);
		$fs->writeText($user5->id, 0,"whatever", "quiz2", "User 5 Quiz 2", "text/plain", FileSystem::PERMISSION_PRIVATE, $time);
		$fs->writeText($user5->id, 0,"otherapp", "quiz2", "User 5 Quiz 2", "text/plain", FileSystem::PERMISSION_PRIVATE, $time);

		$result = $fs->query([]);
		$this->assertCount(4, $result);

        $result = $fs->query(['userId'=>$user3->id]);
        $this->assertCount(1, $result);

        $result = $fs->query(['appTag'=>'whatever']);
        $this->assertCount(3, $result);

        $result = $fs->query(['id'=>$id1]);
        $this->assertCount(1, $result);
    }

    public function test_queryAppTags() {
	    $fs = new FileSystem($this->site->db);

	    $users = new Users($this->site->db);
	    $user3 = $users->get(3);
	    $user5 = $users->get(5);

	    $time = time();
	    $id1 = $fs->writeText($user3->id, 0,"whatever", "quiz1", "User 3 Quiz 1", "text/plain", FileSystem::PERMISSION_PRIVATE, $time);
	    $fs->writeText($user5->id, 0,"whatever", "quiz1", "User 5 Quiz 1 ", "text/plain", FileSystem::PERMISSION_PRIVATE, $time);
	    $fs->writeText($user5->id, 0,"whatever", "quiz2", "User 5 Quiz 2", "text/plain", FileSystem::PERMISSION_PRIVATE, $time);
	    $fs->writeText($user5->id, 0,"otherapp", "quiz2", "User 5 Quiz 2", "text/plain", FileSystem::PERMISSION_PRIVATE, $time);

	    $tags = $fs->queryAppTags();
	    $this->assertEquals('otherapp', $tags[0]);
	    $this->assertEquals('whatever', $tags[1]);
    }


	public function test_delete() {
		$fs = new FileSystem($this->site->db);

		$users = new Users($this->site->db);
		$user3 = $users->get(3);
		$user5 = $users->get(5);

		$json = '{"grid":8}';

		$time = time();
		$id1 = $fs->writeText($user3->id, 0,"whatever", "quiz1", "User 3 Quiz 1", "text/plain", FileSystem::PERMISSION_PRIVATE, $time);
		$fs->writeText($user5->id, 0,"whatever", "quiz1", "User 5 Quiz 1", "text/plain", FileSystem::PERMISSION_PRIVATE, $time);
		$fs->writeText($user5->id, 0,"whatever", "quiz2", "User 5 Quiz 2", "text/plain", FileSystem::PERMISSION_PRIVATE, $time);
		$fs->writeText($user5->id, 0,"otherapp", "quiz2", "User 5 Quiz 2", "text/plain", FileSystem::PERMISSION_PRIVATE, $time);

		$this->assertEquals(3, count($fs->query(['userId'=>$user5->id])));

		$this->assertTrue($fs->delete($user5->id, 0,"whatever", "quiz1"));
		$this->assertEquals(2, count($fs->query(['userId'=>$user5->id])));
		$this->assertEquals(1, count($fs->query(['userId'=>$user3->id])));

		$this->assertTrue($fs->delete($user3->id, 0,"whatever", "quiz1"));
		$this->assertEquals(0, count($fs->query(['userId'=>$user3->id])));
	}


	public function test_writeFile() {
		$fs = new FileSystem($this->site->db);

		$users = new Users($this->site->db);
		$user3 = $users->get(3);

		$file = __DIR__ . "/data/classdiagram.png";

		$time = time() + 1010;
		$id = $fs->writeFile($user3->id, 0,'whatever', 'submission', $file, "image/png", FileSystem::PERMISSION_PRIVATE, $time);

		$this->assertNotFalse($id);

		$file = $fs->readFileId($id);

		$this->assertEquals(3, $file['userId']);
		$this->assertEquals("whatever", $file['appTag']);
		$this->assertEquals("submission", $file['name']);
	}

}

/// @endcond

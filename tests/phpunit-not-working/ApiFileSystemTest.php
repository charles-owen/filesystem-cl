<?php
/** @file
 * @brief Unit tests for the class ApiFileSystem
 * @cond 
 */
require_once __DIR__ . '/init.php';
require_once __DIR__ . '/cls/FileSystemDatabaseTestBase.php';

use CL\Users\Users;
use CL\Site\Api\JsonAPI;
use CL\FileSystem\FileSystem;
use CL\FileSystem\ApiFileSystem;
use CL\Site\Test\ServerMock;


class ApiFileSystemTest extends FileSystemDatabaseTestBase
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

	public function test_save_load() {
		$api = new ApiFileSystem();

		$users = new Users($this->site->db);
		$user = $users->get(5);

		$this->site->users->user = $user;

		$text1 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

		$server = new ServerMock();
		$server->setPost('name', 'Test File');
		$server->setPost('appTag', 'whatever');
		$server->setPost('data', $text1);
		$server->setPost('type', 'text/plain');
		$server->setServer('REQUEST_URI', '/api/filesystem/save');

		$time = time() + 1211;

		$ret = $api->apiDispatch($this->site, $server, ['save'], [], $time);
		$json = new JsonAPI($ret);
		$this->assertFalse($json->hasErrors());

		$server = new ServerMock();
		$server->setPost('name', 'Test File');
		$server->setPost('appTag', 'whatever');
		$server->setServer('REQUEST_URI', '/api/filesystem/load');

		$ret = $api->dispatch($this->site, $server, ['load'], [], $time);
		$this->assertFalse($ret->hasErrors());

		$data = $ret->getData('file-data');
		$this->assertNotNull($data);

		$this->assertEquals($text1, $data[0]['attributes']['data']);

		// Admin file access
		$admin = $users->get(2);

		$server = new ServerMock();
		$server->setPost('name', 'Test File');
		$server->setPost('appTag', 'whatever');
		$server->setPost('userId', '5');
		$server->setServer('REQUEST_URI', '/api/filesystem/load');
		$this->site->users->user = $admin;

		$ret = $api->dispatch($this->site, $server, ['load'], [], $time);
		$this->assertFalse($ret->hasErrors());
	}
}

/// @endcond

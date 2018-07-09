<?php

namespace CL\FileSystem;

use CL\Site\Site;
use CL\Site\System\Server;
use CL\Site\Api\JsonAPI;
use CL\Site\Api\APIException;

/**
 * API Resource for /api/users
 */
class ApiFileSystem extends \CL\Users\Api\ApiResource {
	const QUERY_LIMIT = 500;



	public function __construct() {
		parent::__construct();
	}

	public function dispatch(Site $site, Server $server, array $params, $time) {

//		if(count($params) === 0) {
//			return $this->query($site, $server);
//		}

		switch($params[0]) {

			case 'tables':
				return $this->tables($site, $server, new FileSystemTables($site->db));
		}

		throw new APIException("Invalid API Path", APIException::INVALID_API_PATH);
	}


}
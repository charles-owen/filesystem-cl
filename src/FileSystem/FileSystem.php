<?php
/**
 * @file
 * Class for the user file system
 */

namespace CL\FileSystem;

use CL\Users\User;
use CL\Users\Users;
use CL\Tables\TableWhere;

/**
 * Class for the File System tables
 */
class FileSystem extends \CL\Tables\Table {
	const PERMISSION_PUBLIC = 'P';
	const PERMISSION_PRIVATE = 'X';

	/**
	 * FileSystem constructor.
	 * @param \CL\Tables\Config $config Database configuration object
	 */
	function __construct(\CL\Tables\Config $config) {
		parent::__construct($config, "filesystem");
	}

	/** Function to create an SQL create table command for the users table */
	public function createSQL() {

		$query = <<<SQL
CREATE TABLE IF NOT EXISTS `$this->tablename` (
  id         int(11) NOT NULL AUTO_INCREMENT, 
  userid     int(11) NOT NULL, 
  name       varchar(255) NOT NULL, 
  apptag     varchar(30) NOT NULL comment 'The application tag is a tag that indicates a using application such as cirsim or other other specific use.', 
  data       longblob, 
  type       varchar(50), 
  created    datetime NOT NULL, 
  modified   datetime NOT NULL, 
  version    int(11) NOT NULL comment 'Optional for versioning system', 
  permission char(1) NOT NULL, 
  PRIMARY KEY (id), 
  CONSTRAINT unique_name 
    UNIQUE (name, apptag, userid), 
  INDEX (userid));
SQL;


		return $query;
	}

	/**
	 * @param User $user User to search
	 * @param string $assignTag Assignment
	 * @param $tag Tag
	 * @param $name File name
	 */
	public function delete($userId, $appTag, $name) {
		$sql = <<<SQL
delete from $this->tablename
where userid=? and apptag=? and name=?
SQL;
		//echo "\n";
		//echo $this->sub_sql($sql, $params);

		$stmt = $this->pdo->prepare($sql);
		$stmt->execute([$userId, $appTag, $name]);
		return $stmt->rowCount() > 0;
	}


	/**
	 * File system queries. Returns information about the files, but
	 * not the file data itself.
	 * @param array $params
	 * @return array with keys
	 */
	public function query(array $params) {
        // Utility class that makes it easy to build
        // complex combinations of arbitrary parameters
		$where = new \CL\Tables\TableWhere($this);

		if(isset($params['id'])) {
			$where->append('filesystem.id=?', $params['id'], \PDO::PARAM_INT);
		}

		if(isset($params['userId'])) {
			$where->append('user.id=?', $params['userId']);
		}

		if(isset($params['appTag'])) {
			$where->append('filesystem.apptag=?', $params['appTag']);
		}

		if(isset($params['name'])) {
			$where->append('filesystem.name=?', $params['name']);
		}

        $users = new Users($this->config);
        $usersTable = $users->tablename;

        $sql = <<<SQL
select filesystem.id as id, user.id as userid, user.name as username, user.user as user,
	filesystem.apptag as apptag, filesystem.name as name, filesystem.type as type, 
	filesystem.created as created, filesystem.modified as modified, filesystem.permission as permission
from $this->tablename filesystem
join $usersTable user
on user.id = filesystem.userid
$where->where
order by user.name, filesystem.apptag, filesystem.name
SQL;

		if(isset($params['limit'])) {
			$sql .= "\nlimit ?";
			$where->append(null, intval($params['limit']), \PDO::PARAM_INT);
		}

		//echo $where->sub_sql($sql);
		$result = $where->execute($sql);
		$ret = [];
		foreach($result->fetchAll(\PDO::FETCH_ASSOC) as $row) {
            $created = strtotime($row['created']);
            $modified = strtotime($row['modified']);

            $ret[] = ['id' => $row['id'],
                'username' => $row['username'],
                'userId' => $row['userid'],
                'user' => $row['user'],
                'appTag' => $row['apptag'],
                'name' => $row['name'],
                'type' => $row['type'],
                'created' => $created,
                'modified' => $modified,
                'createdStr' => date("h:i:sa n-d-Y", $created),
                'modifiedStr' => date("h:i:sa n-d-Y", $modified),
	            'permission' => $row['permission']];
		}

		return $ret;
    }


    /**
     * Get all indicated application tags
     */
    public function queryAppTags() {
	    $sql = <<<SQL
select distinct apptag
from $this->tablename
order by apptag
SQL;

	    $stmt = $this->pdo->prepare($sql);
	    try {
		    if(!$stmt->execute()) {
			    return false;
		    }
	    } catch(\PDOException $e) {
		    return false;
	    }

	    $tags = [];
	    foreach($stmt->fetchAll(\PDO::FETCH_ASSOC) as $row) {
	    	$tags[] = $row['apptag'];
	    }

	    return $tags;
    }



	/**
	 * Test if a file exists
	 *
	 * A null users saves as userid=0.
	 * @param int $userId
	 * @param $appTag
	 * @param $name
	 * @return bool true if file exists
	 */
	public function fileExists($userId, $appTag, $name) {
		$pdo = $this->pdo;
		$sql = <<<SQL
select created, modified from $this->tablename
where userid=? and apptag=? and name=?
SQL;

		$created = null;
		$modified = null;

		$stmt = $pdo->prepare($sql);
		$stmt->execute(array($userId, $appTag, $name));

		$stmt->bindColumn(1, $created, \PDO::PARAM_STR);
		$stmt->bindColumn(2, $modified, \PDO::PARAM_STR);
		if($stmt->fetch(\PDO::FETCH_BOUND) !== false) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Write text to a file.
	 * @param int $userId
	 * @param string $appTag
	 * @param string $name
	 * @param string $data
	 * @param string $type
	 * @param string $permission File permission
	 * @param int $time
	 * @return int ID for the new entry or false if fail
	 */
	public function writeText($userId, $appTag,
							   $name, $data, $type, $permission, $time) {
		$pdo = $this->pdo;

		$sql = <<<SQL
insert into $this->tablename(userid, apptag, name, data, type, created, modified, permission)
values(?, ?, ?, ?, ?, ?, ?, ?)
SQL;

		$dateStr = $this->timeStr($time);

		$stmt = $pdo->prepare($sql);
		$stmt->bindParam(1, $userId);
		$stmt->bindParam(2, $appTag);
		$stmt->bindParam(3, $name);
		$stmt->bindParam(4, $data);
		$stmt->bindParam(5, $type);
		$stmt->bindParam(6, $dateStr);
		$stmt->bindParam(7, $dateStr);
		$stmt->bindParam(8, $permission);

		$pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

		try {
			if(!$stmt->execute()) {
				return false;
			}
		} catch(\PDOException $e) {
			return false;
		}

		return $pdo->lastInsertId();
	}

	/**
	 * Update the text in a record.
	 * @param \User $user
	 * @param $assignTag
	 * @param $tag
	 * @param $name
	 * @param $data
	 * @param $type
	 * @param string $permission File permission
	 * @param int $time
	 * @return bool
	 */
	public function updateText($userId, $appTag, $name, $data, $type, $permission, $time) {
		$pdo = $this->pdo;

		$sql = <<<SQL
update $this->tablename
set data=?, type=?, modified=?, permission=?
where userid=? and apptag=? and name=?
SQL;

		$dateStr = $this->timeStr($time);

		$stmt = $pdo->prepare($sql);

		$stmt->bindParam(1, $data);
		$stmt->bindParam(2, $type);
		$stmt->bindParam(3, $dateStr);
		$stmt->bindParam(4, $permission);

		$stmt->bindParam(5, $userId);
		$stmt->bindParam(6, $appTag);
		$stmt->bindParam(7, $name);

		try {
			if(!$stmt->execute()) {
				return false;
			}
		} catch(\PDOException $e) {
			return false;
		}

		return $stmt->rowCount() > 0;
	}

	public function readText($userId, $appTag, $name) {
		$pdo = $this->pdo;

		$sql = <<<SQL
select id, `data`, type, created, modified, permission from $this->tablename
where userid=? and apptag=? and name=?
SQL;

		$id = null;
		$data = null;
		$type = null;
		$created = null;
		$modified = null;
		$permission = null;

		$stmt = $pdo->prepare($sql);
		$stmt->execute([$userId, $appTag, $name]);

		//echo $this->sub_sql($sql, [$userId, $appTag, $name]);

		$stmt->bindColumn(1, $id, \PDO::PARAM_INT);
		$stmt->bindColumn(2, $data, \PDO::PARAM_STR);
		$stmt->bindColumn(3, $type, \PDO::PARAM_STR);
		$stmt->bindColumn(4, $created, \PDO::PARAM_STR);
		$stmt->bindColumn(5, $modified, \PDO::PARAM_STR);
		$stmt->bindColumn(6, $permission, \PDO::PARAM_STR);
		if($stmt->fetch(\PDO::FETCH_BOUND) !== false) {
			return [
				'id' => $id,
				'data' => $data,
				'type' => $type,
				'created' => strtotime($created),
				'modified' => strtotime($modified),
				'permission' => $permission
				];
		} else {
			return null;
		}
	}

	public function readTextId($id) {
		$pdo = $this->pdo;
		$where = new \CL\Tables\TableWhere($this);

		$sql = <<<SQL
select userid, `name`, apptag, `data`, `type`, created, modified, permission
from $this->tablename
where id=?
SQL;

		$userId = null;
		$name = null;
		$appTag = null;
		$data = null;
		$type = null;
		$created = null;
		$modified = null;
		$permission = null;

		//echo $this->sub_sql($sql, [$id]);

		$stmt = $pdo->prepare($sql);
		$stmt->execute([$id]);


		$stmt->bindColumn(1, $userId, \PDO::PARAM_INT);
		$stmt->bindColumn(2, $name, \PDO::PARAM_STR);
		$stmt->bindColumn(3, $appTag, \PDO::PARAM_STR);
		$stmt->bindColumn(4, $data, \PDO::PARAM_STR);
		$stmt->bindColumn(5, $type, \PDO::PARAM_STR);
		$stmt->bindColumn(6, $created, \PDO::PARAM_STR);
		$stmt->bindColumn(7, $modified, \PDO::PARAM_STR);
		$stmt->bindColumn(8, $permission, \PDO::PARAM_STR);
		if($stmt->fetch(\PDO::FETCH_BOUND) !== false) {
			return [
				'id'=>$id,
				'userId'=>$userId,
				'name'=>$name,
				'appTag'=>$appTag,
				'data' => $data,
				'type' => $type,
				'created' => strtotime($created),
				'modified' => strtotime($modified),
				'permission' => $permission];
		} else {
			return null;
		}
	}


	/**
	 * Write data to a file based on a file pointer.
	 * @param int $userId
	 * @param string $appTag
	 * @param string $name
	 * @param string $data
	 * @param string $type
	 * @param int $time
	 * @return int ID for the new entry or false if fail
	 */
	public function writeFile($userId, $appTag,
	                          $name, $file, $type, $permission, $time) {
		$pdo = $this->pdo;

		$sql = <<<SQL
insert into $this->tablename(userid, apptag, name, data, type, created, modified, permission)
values(?, ?, ?, ?, ?, ?, ?, ?)
SQL;

		$fp = fopen($file, 'rb');
		if($fp === false) {
			return false;
		}

		$dateStr = $this->timeStr($time);

		$stmt = $pdo->prepare($sql);
		$stmt->bindParam(1, $userId);
		$stmt->bindParam(2, $appTag);
		$stmt->bindParam(3, $name);
		$stmt->bindParam(4, $fp, \PDO::PARAM_LOB);
		$stmt->bindParam(5, $type);
		$stmt->bindParam(6, $dateStr);
		$stmt->bindParam(7, $dateStr);
		$stmt->bindParam(8, $permission);

		$pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

		try {
			if(!$stmt->execute()) {
				return false;
			}
		} catch(\PDOException $e) {
			return false;
		}

		return $pdo->lastInsertId();
	}


	public function readFileId($id) {
		$pdo = $this->pdo;
		$where = new \CL\Tables\TableWhere($this);

		$sql = <<<SQL
select `data`, userid, `name`, apptag, `type`, created, modified, permission
from $this->tablename
where id=?
SQL;

		$userId = null;
		$name = null;
		$appTag = null;
		$data = null;
		$type = null;
		$created = null;
		$modified = null;
		$permission = null;

		//echo $this->sub_sql($sql, [$id]);

		$stmt = $pdo->prepare($sql);
		$stmt->execute([$id]);


		$stmt->bindColumn(1, $data, \PDO::PARAM_LOB);
		$stmt->bindColumn(2, $userId, \PDO::PARAM_INT);
		$stmt->bindColumn(3, $name, \PDO::PARAM_STR);
		$stmt->bindColumn(4, $appTag, \PDO::PARAM_STR);
		$stmt->bindColumn(5, $type, \PDO::PARAM_STR);
		$stmt->bindColumn(6, $created, \PDO::PARAM_STR);
		$stmt->bindColumn(7, $modified, \PDO::PARAM_STR);
		$stmt->bindColumn(8, $permission, \PDO::PARAM_STR);
		if($stmt->fetch(\PDO::FETCH_BOUND) !== false) {
			return [
				'userId'=>$userId,
				'name'=>$name,
				'appTag'=>$appTag,
				'binary' => $data,
				'type' => $type,
				'created' => strtotime($created),
				'modified' => strtotime($modified),
				'permission'=> $permission
			];
		} else {
			return null;
		}
	}

}
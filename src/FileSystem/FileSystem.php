<?php
/**
 * @file
 * Class for the user file system
 */

namespace CL\FileSystem;

use CL\Users\User;
use CL\Users\Users;
use CL\Tables\TableWhere;
use CL\Tables\TableException;

/**
 * Class for the File System tables.
 *
 * File system tables can be accessed by either the user ID or the member ID.
 * If the course system is not installed, memberId will be set to zero.
 */
class FileSystem extends \CL\Tables\Table {
	/// File permission is public
	const PERMISSION_PUBLIC = 'P';

	/// File permission is private
	const PERMISSION_PRIVATE = 'X';

	/**
	 * FileSystem constructor.
	 * @param \CL\Tables\Config $config Database configuration object
	 */
	function __construct(\CL\Tables\Config $config) {
		parent::__construct($config, "filesystem");
	}

	/**
	 * Function to create an SQL create table command for the users table
	 * @return string SQL
	 */
	public function createSQL() {

		$query = <<<SQL
CREATE TABLE IF NOT EXISTS `$this->tablename` (
  id         int(11) NOT NULL AUTO_INCREMENT, 
  userid     int(11) NOT NULL, 
  memberid   int(11) NOT NULL, 
  apptag     varchar(30) NOT NULL comment 'The application tag is a tag that indicates a using application such as cirsim or other other specific use.', 
  name       varchar(255) NOT NULL, 
  data       longblob, 
  type       varchar(50), 
  created    datetime NOT NULL, 
  modified   datetime NOT NULL, 
  version    int(11) NOT NULL comment 'Optional for versioning system', 
  permission char(1) NOT NULL, 
  PRIMARY KEY (id), 
  CONSTRAINT unique_name 
    UNIQUE (name, apptag, userid, memberid), 
  INDEX (userid), 
  INDEX (memberid));

SQL;


		return $query;
	}

	/**
	 * @param int $userId User internal id
	 * @param int $memberId Membership internal id or 0 if no membership
	 * @param string $appTag Tag An application tag for this file
	 * @param string $name File name within the application scope
	 * @return true if successfully deleted
	 */
	public function delete($userId, $memberId, $appTag, $name) {
		$sql = <<<SQL
delete from $this->tablename
where userid=? and memberid=? and apptag=? and name=?
SQL;
		//echo "\n";
		//echo $this->sub_sql($sql, $params);

		$stmt = $this->pdo->prepare($sql);
		$stmt->execute([$userId, $memberId, $appTag, $name]);
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
		$where = new TableWhere($this);

		if(isset($params['id'])) {
			$where->append('filesystem.id=?', $params['id'], \PDO::PARAM_INT);
		}

		if(isset($params['userId'])) {
			$where->append('user.id=?', $params['userId']);
		}

		if(isset($params['memberId'])) {
			$where->append('memberid=?', $params['memberId']);
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
select filesystem.id as id, filesystem.memberid as memberid, user.id as userid, user.name as username, user.user as user,
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

		// echo $where->sub_sql($sql);
		try {
			$result = $where->execute($sql);
		} catch (TableException $exception) {
			return null;
		}

		$ret = [];
		foreach($result->fetchAll(\PDO::FETCH_ASSOC) as $row) {
			$created = strtotime($row['created']);
			$modified = strtotime($row['modified']);

			$ret[] = ['id' => +$row['id'],
				'username' => $row['username'],
				'userId' => +$row['userid'],
				'memberId' => +$row['memberid'],
				'user' => $row['user'],
				'appTag' => $row['apptag'],
				'name' => $row['name'],
				'type' => $row['type'],
				'created' => $created,
				'modified' => $modified,
				'createdStr' => date("n-d-Y h:i:sa", $created),
				'modifiedStr' => date("n-d-Y h:i:sa", $modified),
				'permission' => $row['permission']];
		}

		return $ret;
    }


    /**
     * Get all indicated application tags
     * @return array of tags
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
	 * A null user saves as userid=0 and memberid=0
	 *
	 * @param int $userId User internal id
	 * @param int $memberId Member internal id or 0 if none
	 * @param string $appTag Application or assignment tag
	 * @param string $name Filename
	 * @return bool true if file exists
	 */
	public function fileExists($userId, $memberId, $appTag, $name) {
		$pdo = $this->pdo;
		$sql = <<<SQL
select created, modified from $this->tablename
where userid=? and memberid=? and apptag=? and name=?
SQL;

		$created = null;
		$modified = null;

		$stmt = $pdo->prepare($sql);
		$stmt->execute(array($userId, $memberId, $appTag, $name));

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
	 * @param int $userId User internal id
	 * @param int $memberId Member internal id or 0 if none
	 * @param string $appTag Application or assignment tag
	 * @param string $name Filename
	 * @param string $data
	 * @param string $type
	 * @param string $permission File permission
	 * @param int $time
	 * @return int ID for the new entry or false if fail
	 */
	public function writeText($userId, $memberId, $appTag,
							   $name, $data, $type, $permission, $time) {
		$pdo = $this->pdo;

		$sql = <<<SQL
insert into $this->tablename(userid, memberid, apptag, name, data, type, created, modified, permission)
values(?, ?, ?, ?, ?, ?, ?, ?, ?)
SQL;

		$dateStr = $this->timeStr($time);

		$stmt = $pdo->prepare($sql);
		$stmt->bindParam(1, $userId);
		$stmt->bindParam(2, $memberId);
		$stmt->bindParam(3, $appTag);
		$stmt->bindParam(4, $name);
		$stmt->bindParam(5, $data);
		$stmt->bindParam(6, $type);
		$stmt->bindParam(7, $dateStr);
		$stmt->bindParam(8, $dateStr);
		$stmt->bindParam(9, $permission);

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
	 * @param int $userId User internal id
	 * @param int $memberId Member internal id or 0 if none
	 * @param string $appTag Application or assignment tag
	 * @param string $name Filename
	 * @param $data
	 * @param $type
	 * @param string $permission File permission
	 * @param $time
	 * @return bool
	 */
	public function updateText($userId, $memberId, $appTag, $name, $data, $type, $permission, $time) {
		$pdo = $this->pdo;

		$sql = <<<SQL
update $this->tablename
set data=?, type=?, modified=?, permission=?
where userid=? and memberid=? and apptag=? and name=?
SQL;

		$dateStr = $this->timeStr($time);

		$stmt = $pdo->prepare($sql);

		$stmt->bindParam(1, $data);
		$stmt->bindParam(2, $type);
		$stmt->bindParam(3, $dateStr);
		$stmt->bindParam(4, $permission);

		$stmt->bindParam(5, $userId);
		$stmt->bindParam(6, $memberId);
		$stmt->bindParam(7, $appTag);
		$stmt->bindParam(8, $name);

		// echo $this->sub_sql($sql, [$data, $type, $dateStr, $permission, $userId, $memberId, $appTag, $name]);

		try {
			if(!$stmt->execute()) {
				return false;
			}
		} catch(\PDOException $e) {
			return false;
		}

		return true;
	}

	/**
	 * Read text from a file.
	 * @param int $userId User internal id
	 * @param int $memberId Member internal id or 0 if none
	 * @param string $appTag Application or assignment tag
	 * @param string $name Filename
	 * @return array with keys 'id', 'data', 'type', 'created', 'modified', and 'permission'
	 */
	public function readText($userId, $memberId, $appTag, $name) {
		$pdo = $this->pdo;

		$sql = <<<SQL
select id, `data`, type, created, modified, permission from $this->tablename
where userid=? and memberid=? and apptag=? and name=?
SQL;

		$id = null;
		$data = null;
		$type = null;
		$created = null;
		$modified = null;
		$permission = null;

		$stmt = $pdo->prepare($sql);
		$stmt->execute([$userId, $memberId, $appTag, $name]);

		//echo $this->sub_sql($sql, [$userId, $memberId, $appTag, $name]);

		$stmt->bindColumn(1, $id, \PDO::PARAM_INT);
		$stmt->bindColumn(2, $data, \PDO::PARAM_STR);
		$stmt->bindColumn(3, $type, \PDO::PARAM_STR);
		$stmt->bindColumn(4, $created, \PDO::PARAM_STR);
		$stmt->bindColumn(5, $modified, \PDO::PARAM_STR);
		$stmt->bindColumn(6, $permission, \PDO::PARAM_STR);
		if($stmt->fetch(\PDO::FETCH_BOUND) !== false) {
			return [
				'id' => +$id,
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

	/**
	 * Read text from a file.
	 * @param int $id ID for the file
	 * @return array with keys 'id', 'userId', 'memberId', 'data', 'type', 'created', 'modified', and 'permission'
	 */
	public function readTextId($id) {
		$pdo = $this->pdo;
		$where = new \CL\Tables\TableWhere($this);

		$sql = <<<SQL
select userid, memberid, `name`, apptag, `data`, `type`, created, modified, permission
from $this->tablename
where id=?
SQL;

		$userId = null;
		$memberId = null;
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
		$stmt->bindColumn(2, $memberId, \PDO::PARAM_INT);
		$stmt->bindColumn(3, $name, \PDO::PARAM_STR);
		$stmt->bindColumn(4, $appTag, \PDO::PARAM_STR);
		$stmt->bindColumn(5, $data, \PDO::PARAM_STR);
		$stmt->bindColumn(6, $type, \PDO::PARAM_STR);
		$stmt->bindColumn(7, $created, \PDO::PARAM_STR);
		$stmt->bindColumn(8, $modified, \PDO::PARAM_STR);
		$stmt->bindColumn(9, $permission, \PDO::PARAM_STR);
		if($stmt->fetch(\PDO::FETCH_BOUND) !== false) {
			return [
				'id'=>+$id,
				'userId'=>+$userId,
				'memberId'=>+$memberId,
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
	 * @param int $userId User internal id
	 * @param int $memberId Member internal id or 0 if none
	 * @param string $appTag Application or assignment tag
	 * @param string $name Filename
	 * @param mixed $file
	 * @param string $type
	 * @param string $permission File permission to set
	 * @param int $time
	 * @return int ID for the new entry or false if fail
	 */
	public function writeFile($userId, $memberId, $appTag,
	                          $name, $file, $type, $permission, $time) {
		$pdo = $this->pdo;

		$sql = <<<SQL
insert into $this->tablename(userid, memberid, apptag, name, data, type, created, modified, permission)
values(?, ?, ?, ?, ?, ?, ?, ?, ?)
SQL;

		$fp = fopen($file, 'rb');
		if($fp === false) {
			return false;
		}

		$dateStr = $this->timeStr($time);

		$stmt = $pdo->prepare($sql);
		$stmt->bindParam(1, $userId);
		$stmt->bindParam(2, $memberId);
		$stmt->bindParam(3, $appTag);
		$stmt->bindParam(4, $name);
		$stmt->bindParam(5, $fp, \PDO::PARAM_LOB);
		$stmt->bindParam(6, $type);
		$stmt->bindParam(7, $dateStr);
		$stmt->bindParam(8, $dateStr);
		$stmt->bindParam(9, $permission);

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
	 * Read a file based on an ID
	 * @param int $id ID for the file
	 * @return array with keys 'id', 'userId', 'memberId', 'binary', 'type', 'created', 'modified', and 'permission'
	 */
	public function readFileId($id) {
		$pdo = $this->pdo;
		$where = new \CL\Tables\TableWhere($this);

		$sql = <<<SQL
select `data`, userid, memberid, `name`, apptag, `type`, created, modified, permission
from $this->tablename
where id=?
SQL;

		$userId = null;
		$memberId = null;
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
		$stmt->bindColumn(3, $memberId, \PDO::PARAM_INT);
		$stmt->bindColumn(4, $name, \PDO::PARAM_STR);
		$stmt->bindColumn(5, $appTag, \PDO::PARAM_STR);
		$stmt->bindColumn(6, $type, \PDO::PARAM_STR);
		$stmt->bindColumn(7, $created, \PDO::PARAM_STR);
		$stmt->bindColumn(8, $modified, \PDO::PARAM_STR);
		$stmt->bindColumn(9, $permission, \PDO::PARAM_STR);
		if($stmt->fetch(\PDO::FETCH_BOUND) !== false) {
			return [
				'id' => +$id,
				'userId'=>+$userId,
				'memberId'=>+$memberId,
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

	/**
	 * Table cleaning. Removes expired autologin records and any orphaned autologin
	 * returns (no current user).
	 * @return string Text result of cleaning of null if not implemented.
	 */
	public function clean($time=null) {
		$users = new \CL\Users\Users($this->config);
		$result = '';

		$sql = <<<SQL
delete from $this->tablename
where userid not in (
	select id
	from $users->tablename
)
SQL;

		$stmt = $this->pdo->prepare($sql);
		if($stmt->execute([]) === false) {
			return "Error accessing file system table\n";
		}

		$cnt = $stmt->rowCount();
		if($cnt > 0) {
			$result .= "Removed $cnt orphaned file system records\n";
		} else {
			$result .= "No orphaned file system records\n";
		}

		return $result;
	}

}
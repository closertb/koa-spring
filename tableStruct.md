### rule表
```
CREATE TABLE `rule_param` (
  `id` bigint(19) NOT NULL AUTO_INCREMENT,
  `scene_code` varchar(50) NOT NULL DEFAULT '' COMMENT '场景编码',
  `param_code` varchar(50) NOT NULL DEFAULT '' COMMENT '参数英文名',
  `param_name` varchar(255) NOT NULL DEFAULT '' COMMENT '参数中文名',
  `param_type` varchar(50) NOT NULL DEFAULT '' COMMENT '参数类型',
  `is_delete` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0 正常 1 删除',
  `operator_add` varchar(50) NOT NULL DEFAULT 'SYS',
  `operator_modify` varchar(50) NOT NULL DEFAULT 'SYS',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  `related_enums` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
```

### rule_enums表
```
CREATE TABLE `rule_enums` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `tag` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `status` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
```
### 日志表
```
CREATE TABLE `change_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `userId` varchar(100) NOT NULL COMMENT '用户Id',
  `update_type` varchar(100) NOT NULL COMMENT 'RULE or RULE_DETAIL',
  `update_id` int(11) NOT NULL COMMENT '更新的数据Id 更新为id  新增为-1',
  `field` varchar(100) NOT NULL COMMENT '字段',
  `before` varchar(1500) NOT NULL COMMENT '修改之前的值',
  `after` varchar(1500) NOT NULL COMMENT '修改之后的值',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='操作记录';
```

const replacements = {
 "_uuid" : "[uuid]", 
 "_text" : "[String]",
 "_int4" : "[Int]",
 "_varchar": "[String]",
};

let  mutations = {
  AddInstrumentWithID: `
mutation AddInstrument($id: String, $category: Int, $line_id: uuid, $name: String, $user_id: uuid, $instrument_type: Int,$isOffline: Boolean,$isScalingFactors: Boolean, $instrument_class:  Int,$isForeCast:Boolean) {
  insert_neo_skeleton_instruments_one(object: {category: $category,instrument_class: $instrument_class, id: $id, line_id: $line_id, name: $name, updated_by: $user_id, instrument_type: $instrument_type, created_by: $user_id, ignore: false,is_offline:$isOffline,is_scaling_factor:$isScalingFactors,enable_forecast:$isForeCast}, on_conflict: {constraint: instruments_pkey, update_columns: [category, name, line_id, instrument_type]}) {
  id
  }
  }
`,
addForecasting: `
mutation addForecasting($objects: [neo_skeleton_instruments_metrics_forecasting_insert_input!]!) {
  insert_neo_skeleton_instruments_metrics_forecasting(objects: $objects) {
    affected_rows
    returning {
      ins_met_is
      instruments_metric {
        metrics_id
        instruments_id
        metric {
          name
        }
      }
    }
  }
}
`,
  addInstrumentMetrics: `
mutation addInstrumentMetrics($formMetrics: [neo_skeleton_instruments_metrics_insert_input!]!) {
  insert_neo_skeleton_instruments_metrics(objects: $formMetrics) {
    affected_rows
    returning {
      id
      metrics_id
      enable_forecast
      instruments_id
    }
  }
}
`,
  AddInstrumentWithoutID: `
mutation AddInstrument($category: Int, $line_id: uuid, $name: String, $user_id: uuid, $instrument_type: Int,$isOffline: Boolean,$isForeCast: Boolean) {
  insert_neo_skeleton_instruments_one(object: {category: $category line_id: $line_id, name: $name, updated_by: $user_id, instrument_type: $instrument_type, created_by: $user_id, ignore: false,is_offline:$isOffline,enable_forecast:$isForeCast}, on_conflict: {constraint: instruments_pkey, update_columns: [category, name, line_id, instrument_type]}) {
  id
  }
}`,
  UpdateInstrument: `
mutation UpdateInstrument($id: String, $line_id: uuid, $category: Int, $instrument_type: Int, $name: String, $updated_by: uuid,$isOffline: Boolean,$isScalingFactors: Boolean,$instrument_class: Int,$isForeCast: Boolean) {
  update_neo_skeleton_instruments(where: {id: {_eq: $id}, _and: {line_id: {_eq: $line_id}}}, _set: {name: $name, instrument_type: $instrument_type, instrument_class: $instrument_class, category: $category, updated_by: $updated_by,is_offline:$isOffline,is_scaling_factor:$isScalingFactors,enable_forecast:$isForeCast}) {
    affected_rows    
  }
}
`,
  delAlertsV2: `
mutation delete_neo_skeleton_alerts_v2( $insrument_metrics_id: [Int!] ) {
  delete_neo_skeleton_alerts_v2(where: {insrument_metrics_id: {_in: $insrument_metrics_id}}) {
    affected_rows
  }
}
`,
delSensor: `
mutation delete_neo_skeleton_sensors($id: uuid) {
  delete_neo_skeleton_sensors(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`,
  deleteInstrumentMetrics: `
mutation deleteInstrumentMetrics($instruments_id: String , $metrics_id: [bigint!] ) {
  delete_neo_skeleton_instruments_metrics(where: {instruments_id: {_eq: $instruments_id}, metrics_id: {_in: $metrics_id}}) {
    affected_rows
  }
}
`,
  deleteInstrumentAnnotations: `
mutation deleteInstrumentAnnotations($instruments_id: String) {
  delete_neo_skeleton_data_annotations(where: {instrument_id: {_eq: $instruments_id}}) {
    affected_rows
  }
}
`,

  deleteInstrumentOEEConfig: `
mutation deleteInstrumentOEEConfig($instruments_id: String) {
  delete_neo_skeleton_prod_asset_oee_config(where: {part_signal_instrument: {_eq: $instruments_id}}) {
    affected_rows
  }
}
`,

  SaveLineDetails: `
  mutation SaveLineDetails($location: String, $name: String, $line_id: uuid, $energy_asset: uuid, $dash_aggregation: String, $mic_stop_duration: numeric, $shift: jsonb , $node : jsonb, $custom_name: String) {
    update_neo_skeleton_lines(where: {id: {_eq: $line_id}}, _set: {name: $name, location: $location, energy_asset: $energy_asset, dash_aggregation: $dash_aggregation, mic_stop_duration: $mic_stop_duration, shift: $shift , node : $node, custom_name: $custom_name }) {
      affected_rows
      returning {
        name
        location
        custom_name
      }
    }
  }
  `,

  SaveLicensingDetails: `
mutation SaveLicensingDetails($line_id: uuid, $expiry_date: timestamptz, $expiry_remainder: Int) {
  update_neo_skeleton_licensing_table(where: {line_id: {_eq: $line_id}}, _set: {line_id: $line_id, expiry_date: $expiry_date ,expiry_remainder: $expiry_remainder}) {
    affected_rows
    returning {
      expiry_date
      expiry_remainder
    }
  }
}
  `,
  AddLicensingDetails: `
 mutation AddLicensingDetails($line_id: uuid,$expiry_date: timestamptz, $expiry_remainder: Int) {
  insert_neo_skeleton_licensing_table(objects: {line_id: $line_id,expiry_date: $expiry_date, expiry_remainder: $expiry_remainder}) {
    returning {
      id
      line_id
      expiry_date
      expiry_remainder
    }
  }
}
`,
  addInstrumentFormula: `
 mutation AddNewVirtualInstrument($name: String, $line_id: uuid, $formula: String, $created_by: uuid) {
  insert_neo_skeleton_virtual_instruments_one(object: {line_id: $line_id, name: $name, formula: $formula, created_by: $created_by}, on_conflict: {constraint: virtual_instruments_pkey, update_columns: formula}) {
    id
  }
}

`,
  editInstrumentFormula: `
mutation EditVirtualInstrument($name: String, $line_id: uuid, $formula: String, $for_id: uuid, $updated_by: uuid) {
  update_neo_skeleton_virtual_instruments(where: {id: {_eq: $for_id}, _and: {line_id: {_eq: $line_id}}}, _set: {formula: $formula, name: $name, updated_by: $updated_by}) {
    affected_rows
  }
}

`,
  deleteInstrumentFormula: `
  mutation DeleteVirtualInstrument($vir_id: uuid) {
    lines: update_neo_skeleton_lines(where: {energy_asset: {_eq: $vir_id}}, _set: {energy_asset: null}) {
      returning {
        id
      }
      affected_rows
    }
    virtual_instruments :
    delete_neo_skeleton_virtual_instruments(where: {id: {_eq: $vir_id}}) {
      affected_rows
      returning {
        id
      }
    }
  }
  
`,
  addproducts: `
  mutation addProduct($product_id: String, $name: String, $line_id: uuid, $unit: String, $user_id: uuid, $info: jsonb, $expected_energy: Float, $moisture_in: Float, $moisture_out: Float, $cycle_time_unit: Int, $expected_energy_unit: Int, $is_micro_stop: Boolean, $mic_stop_from_time: Int, $mic_stop_to_time: Int) {
    insert_neo_skeleton_prod_products_one(object: {product_id: $product_id, name: $name, line_id: $line_id, unit: $unit, updated_by: $user_id, info: $info, created_by: $user_id, expected_energy: $expected_energy, moisture_in: $moisture_in, moisture_out: $moisture_out, cycle_time_unit: $cycle_time_unit, expected_energy_unit: $expected_energy_unit, is_micro_stop: $is_micro_stop, mic_stop_from_time: $mic_stop_from_time, mic_stop_to_time: $mic_stop_to_time}) {
      id
    }
  }
`,
  delproducts: `
mutation deleteProduct($id: uuid) {
  delete_neo_skeleton_prod_products(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`,
  editProduct: `
mutation editProduct($id: uuid, $product_id: String, $name: String, $unit: String, $user_id: uuid, $info: jsonb, $expected_energy : Float, $moisture_in: Float, $moisture_out: Float, $cycle_time_unit: Int, $expected_energy_unit: Int, $is_micro_stop: Boolean, $mic_stop_from_time: Int, $mic_stop_to_time: Int) {
  update_neo_skeleton_prod_products(where: {id: {_eq: $id}}, _set: {product_id: $product_id, name: $name, unit: $unit, updated_by: $user_id, info: $info , expected_energy : $expected_energy, moisture_in: $moisture_in, moisture_out: $moisture_out, cycle_time_unit: $cycle_time_unit, expected_energy_unit: $expected_energy_unit, is_micro_stop: $is_micro_stop, mic_stop_from_time: $mic_stop_from_time, mic_stop_to_time: $mic_stop_to_time}) {
    affected_rows
  }
}
`,

addWorkInitiations:`
mutation addWorkExec($order_id: uuid, $line_id: uuid, $start_dt: timestamptz, $end_dt: timestamptz, $operator_id: uuid $entity_id: uuid, $user_id: uuid) {
  insert_neo_skeleton_prod_exec_one(object: {order_id: $order_id, start_dt: $start_dt, end_dt: $end_dt, operator_id: $operator_id, entity_id: $entity_id, updated_by: $user_id, created_by: $user_id, line_id: $line_id}) {
    id
  }
}
`,







  addReasons: `
mutation addReason($reason: String, $type_id: bigint, $user_id: uuid, $line_id: uuid, $include_in_oee: Boolean , $reason_tag : _uuid,$hmi:Int) {
  insert_neo_skeleton_prod_reasons_one(object: {reason: $reason, reason_type_id: $type_id, created_by: $user_id, updated_by: $user_id, line_id: $line_id, include_in_oee: $include_in_oee , reason_tag : $reason_tag,hmi:$hmi}) {
    id
  }
}
`,
  deleteReasons: `
mutation deleteReason($id: bigint) {
delete_neo_skeleton_prod_reasons(where: {id: {_eq: $id}}) {
  affected_rows
}
}
`,
  editReasons: `
mutation editReason($reason: String, $type_id: bigint, $user_id: uuid, $id: bigint, $include_in_oee: Boolean,$reason_tag : _uuid,$hmi:Int) {
  update_neo_skeleton_prod_reasons(where: {id: {_eq: $id}}, _set: {reason: $reason, reason_type_id: $type_id, updated_by: $user_id, include_in_oee: $include_in_oee , reason_tag : $reason_tag,hmi:$hmi}) {
    affected_rows
  }
}
`,
  deleteDowntime: `
mutation deleteDowntime($id: bigint,$line_id: uuid) {
delete_neo_skeleton_prod_outage(where: {reason_id: {_eq: $id}, line_id: {_eq: $line_id}}) {
  affected_rows
}
}
`,
  deleteProQtyDefact: `
mutation deleteProQtyDefact($_eq: bigint) {
delete_neo_skeleton_prod_quality_defects(where: {reason_id: {_eq: $_eq}}) {
  affected_rows
}
}
`,
  deleteTag: `
mutation deleteTag($id:  [uuid!]) {
  delete_neo_skeleton_prod_reason_tags(where: {id: {_in: $id}}) {
    affected_rows
  }
  }
`,

  deleteproQtyDefactReason: `
mutation deleteProQtyDefact($_eq: bigint, $line_id: uuid) {
  delete_neo_skeleton_prod_quality_defects(where: {reason_id: {_eq: $_eq}, line_id: {_eq: $line_id}}) {
    affected_rows
  }
}

`,
  InsertQualityMetrics: `
mutation InsertQualityMetrics($parameter: [neo_skeleton_quality_metrics_insert_input!]!) {
  insert_neo_skeleton_quality_metrics(objects: $parameter) {
    affected_rows
    returning {
      id
    }
  }
}
`,
  UpdateQualityMetrics: `
mutation UpdateQualityMetrics($id : Int , $parameter : String , $line_id : uuid) {
  update_neo_skeleton_quality_metrics(where: {id: {_eq:$id  }}, _set: {line_id: $line_id, parameter:$parameter }) {
    affected_rows
  }
}`,
  DeleteQualityMetrics: `
  mutation DeleteQualityMetrics( $id: [Int!]) {
    delete_neo_skeleton_quality_metrics(where: {id: {_in: $id}}) {
      affected_rows
    }
  }
  
`,
  UpdateShitTimings: `
mutation MyMutation2($line_id: uuid, $shift: jsonb) {
  update_neo_skeleton_lines(where: {id: {_eq: $line_id}}, _set: {shift: $shift}) {
    affected_rows
  }
}
`,

  UpdateTimeSlotTimings: `
mutation TimeSlotData($line_id: uuid, $timeslot: jsonb) {
  update_neo_skeleton_lines(where: {id: {_eq: $line_id}}, _set: {timeslot: $timeslot}) {
    affected_rows
  }
}
`,

  EditChannelLineAccess: `
  mutation EditChannelLineAccess($id: uuid, $updated_by: uuid, $type: uuid, $parameter: String,$name: String) {
    update_neo_skeleton_notification_channels(where: {id: {_eq: $id}}, _set: {name: $name, parameter: $parameter, type: $type, updated_by: $updated_by}) {
      affected_rows
    }
  }
  `,
  CreateNewChannel: `
  mutation CreateNewChannel($type: uuid, $line_id: uuid,$name: String, $parameter: String, $created_by: uuid) {
    insert_neo_skeleton_notification_channels_one(object: {type: $type, name: $name, parameter: $parameter, line_id: $line_id, created_by: $created_by, updated_by: $created_by}) {
      id
      name
    }
  }
  `,
  DeleteChanellLineAccess: `
  mutation DeleteChanellLineAccess($id: uuid, $line_id: uuid) {
      delete_neo_skeleton_notification_channels(where: {id: {_eq: $id}, _and: {line_id: {_eq: $line_id}}}) {
      affected_rows
      }
  }
  `,
  EditUserLineAccess: `
  mutation EditUserLineAccess($user_id: uuid, $line_id: uuid, $role_id: Int) {
      update_neo_skeleton_user_role_line(where: {user_id: {_eq: $user_id}, _and: {line_id: {_eq: $line_id}}}, _set: {role_id: $role_id}) {
      affected_rows
      }
  }
  `,
  CreateNewUser: `
mutation CreateNewUser($name: String, $mobile: String, $sgid: String, $email: String, $created_by: uuid, $avatar: String,$temp_password: String) {
  insert_neo_skeleton_user_one(object: {name: $name, mobile: $mobile, sgid: $sgid, email: $email, disable: false, avatar: $avatar,temp_password: $temp_password, created_by: $created_by, updated_by: $created_by}) {
    id
    name
  }
}
`,
  CreateUserRoleLineAccess: `
mutation CreateUserRoleLineAccess($user_id: uuid, $role_id: Int, $line_id: uuid, $created_by: uuid) {
  insert_neo_skeleton_user_role_line_one(object: {user_id: $user_id, line_id: $line_id, role_id: $role_id, created_by: $created_by, updated_by: $created_by, disable: false}) {
    line_id
    role_id
    user_id
    userByUserId{
      id
			name
    }
  }
}
`,
  DeleteUserLineAccess: `
mutation DeleteUserLineAccess($user_id: uuid, $line_id: uuid) {
  delete_neo_skeleton_user_role_line(where: {user_id: {_eq: $user_id}, _and: {line_id: {_eq: $line_id}}}) {
    affected_rows
  }
}
`,

  deleteInstrumentMetricswithoutMetric: `
mutation deleteInstrumentMetricswithoutMetric($instrumentid: String  ) {
  delete_neo_skeleton_instruments_metrics(where: {instruments_id: {_eq: $instrumentid}}) {
    affected_rows
  }
}`,

  DeleteInstrument: `
mutation DeleteInstrument($id: String, $line_id: uuid) {
  delete_neo_skeleton_instruments(where: {id: {_eq: $id}, _and: {line_id: {_eq: $line_id}}}) {
    affected_rows
  }
}
`,

  addMetricUnit: `
mutation addMetricUnit($unit: String, $description: String) {
  insert_neo_skeleton_metric_unit_one(object: {description: $description, unit: $unit}) {
    id
  }
}
`,
  addMetric: `
mutation addMetric($metric_datatype: Int, $metric_unit: Int, $name: String, $title: String, $type: Int , $instrument_type : bigint) {
  insert_neo_skeleton_metrics_one(object: {metric_datatype: $metric_datatype, metric_unit: $metric_unit, name: $name, title: $title, type: $type , instrument_type : $instrument_type}) {
    id
  }
}`,
  UpdateFrequency: `
mutation UpdateFrequency($instruments_id: String, $frequency: Int) {
  update_neo_skeleton_instruments_metrics(where: {instruments_id: {_eq: $instruments_id}}, _set: {frequency: $frequency}) {
    affected_rows
  }
}
`,
  AddNewEntity: `
  mutation AddNewEntity($user_id: uuid, $name: String, $line_id: uuid, $entity_type: Int, $asset_types: Int, $info: jsonb,$is_zone:Boolean, $spindle_speed_threshold: Int, $feed_rate_threshold: Int) {
    insert_neo_skeleton_entity(objects: {line_id: $line_id, name: $name, entity_type: $entity_type, asset_types: $asset_types, created_by: $user_id, updated_by: $user_id, info: $info,is_zone:$is_zone, spindle_speed_threshold: $spindle_speed_threshold, feed_rate_threshold: $feed_rate_threshold}) {
      affected_rows
      returning {
        id
      }
    }
  }
  
  `,
  EditAnEntity: `
  mutation EditAnEntity($entity_id: uuid, $entity_type: Int, $asset_types: Int, $name: String, $user_id: uuid, $info: jsonb,$is_zone:Boolean, $spindle_speed_threshold: Int, $feed_rate_threshold: Int) {
    update_neo_skeleton_entity(where: {id: {_eq: $entity_id}}, _set: {name: $name, entity_type: $entity_type, asset_types: $asset_types, updated_by: $user_id, info: $info,is_zone:$is_zone, spindle_speed_threshold: $spindle_speed_threshold, feed_rate_threshold: $feed_rate_threshold}) {
      affected_rows
      returning {
        id
        name
        entity_type
      }
    }
  }
  
  `,
  DeleteAnEntity: `
 mutation DeleteAnEntity($entity_id: uuid) {
  delete_neo_skeleton_node_zone_mapping(where: {entity_id: {_eq: $entity_id}}) {
    affected_rows
  }
  delete_neo_skeleton_solar_alert_status(where: {node_id: {_eq: $entity_id}}) {
    affected_rows
  }
  delete_neo_skeleton_production_form(where: {asset_id: {_eq: $entity_id}}) {
    affected_rows
  }
  delete_neo_skeleton_asset_attachment(where: {entity_id: {_eq: $entity_id}}) {
    affected_rows
  }
   delete_neo_skeleton_entity(where: {id: {_eq: $entity_id}}) {
    affected_rows
  }
}


  `,
  deleteAssetAttachment:` mutation DeleteAnEntityAttachment($entity_id: uuid) {
  delete_neo_skeleton_asset_attachment(where: {entity_id: {_eq: $entity_id}}) {
    affected_rows
  }
  
}`,
  deleteEntityWithRelations: `
  mutation deleteEntityWithRelations($entity_id: uuid) {
    assetInfo:delete_neo_skeleton_entity_info(where: {entity_id: {_eq: $entity_id}}) {
      affected_rows
    }
    oeeConfig: delete_neo_skeleton_prod_asset_oee_config(where: {entity_id: {_eq: $entity_id}}) {
      affected_rows
    }
    execution: delete_neo_skeleton_prod_exec(where: {entity_id: {_eq: $entity_id}}) {
      affected_rows
    }
    downtime: delete_neo_skeleton_prod_outage(where: {entity_id: {_eq: $entity_id}}) {
      affected_rows
    }
    partComment: delete_neo_skeleton_prod_part_comments(where: {asset_id: {_eq: $entity_id}}) {
      affected_rows
    }
    qualityDefects: delete_neo_skeleton_prod_quality_defects(where: {entity_id: {_eq: $entity_id}}) {
      affected_rows
    }
    tasks: delete_neo_skeleton_tasks(where: {entity_id: {_eq: $entity_id}}) {
      affected_rows
    }
    
    maintenancelogs : delete_neo_skeleton_maintenance_log(where: {entity_id: {_eq: $entity_id}}) {
      affected_rows
    }
    entityInstruments: delete_neo_skeleton_entity_instruments(where: {entity_id: {_eq: $entity_id}}) {
      affected_rows
    }
    dryerConfig:delete_neo_skeleton_dryer_config(where: {entity_id: {_eq: $entity_id}}) {
      affected_rows
    }
    assetAttachment: delete_neo_skeleton_asset_attachment(where: {entity_id: {_eq: $entity_id}}) {
    affected_rows
  }
    entity:delete_neo_skeleton_entity(where: {id: {_eq: $entity_id}}) {
      affected_rows
    }
   
  }
  `,
  DeleteOEEConfig: `
  mutation DeleteOEEConfig($entity_id: [uuid!]) {
    delete_neo_skeleton_prod_asset_oee_config(where: {entity_id: {_in: $entity_id}}) {
      affected_rows
      returning {
        entity_id
        id
      }
    }
  }
  `,
  AddorUpdateOEEConfig: `
  mutation AddorUpdateOEEConfig($entity_id: uuid, $part_signal: bigint, $part_signal_instrument: String, $machine_status_signal_instrument: String, $machine_status_signal: bigint, $planned_downtime: numeric, $setup_time: numeric, $enable_setup_time: Boolean, $is_part_count_binary: Boolean, $above_oee_color: String, $above_oee_value: String, $below_oee_color: String, $below_oee_value: String, $between_oee_color: String, $mic_stop_duration: numeric, $is_status_signal_available: Boolean, $dressing_program: String, $dressing_signal: bigint, $is_part_count_downfall : Boolean, $min_mic_stop_duration: numeric,$is_running_downtime: Boolean, $is_standard_microstop: Boolean) {
    insert_neo_skeleton_prod_asset_oee_config_one(object: {entity_id: $entity_id, part_signal_instrument: $part_signal_instrument, part_signal: $part_signal, machine_status_signal: $machine_status_signal, machine_status_signal_instrument: $machine_status_signal_instrument, planned_downtime: $planned_downtime, setup_time: $setup_time, enable_setup_time: $enable_setup_time, is_part_count_binary: $is_part_count_binary, above_oee_color: $above_oee_color, above_oee_value: $above_oee_value, below_oee_color: $below_oee_color, below_oee_value: $below_oee_value, between_oee_color: $between_oee_color, mic_stop_duration: $mic_stop_duration, is_status_signal_available: $is_status_signal_available, dressing_program: $dressing_program, dressing_signal: $dressing_signal, is_part_count_downfall: $is_part_count_downfall, min_mic_stop_duration: $min_mic_stop_duration, is_running_downtime: $is_running_downtime, is_standard_microstop: $is_standard_microstop}, on_conflict: {constraint: prod_asset_oee_config_un, update_columns: [part_signal_instrument, part_signal, machine_status_signal_instrument, machine_status_signal, planned_downtime, setup_time, enable_setup_time, is_part_count_binary, is_part_count_downfall, mic_stop_duration, is_status_signal_available, dressing_signal, dressing_program, min_mic_stop_duration, above_oee_color, above_oee_value, below_oee_color, below_oee_value, between_oee_color, is_running_downtime]}) {
      id
    }
  }
  `,
  AddorUpdateOEEConfigwithoutDressing: `
  mutation AddorUpdateOEEConfig($entity_id: uuid, $part_signal: bigint, $part_signal_instrument: String, $machine_status_signal_instrument: String, $machine_status_signal: bigint, $planned_downtime: numeric, $setup_time: numeric, $enable_setup_time: Boolean, $is_part_count_binary: Boolean, $above_oee_color: String, $above_oee_value: String, $below_oee_color: String, $below_oee_value: String, $between_oee_color: String, $mic_stop_duration: numeric, $is_status_signal_available: Boolean, $is_part_count_downfall : Boolean, $min_mic_stop_duration: numeric, $is_running_downtime: Boolean, $is_standard_microstop: Boolean) {
    insert_neo_skeleton_prod_asset_oee_config_one(object: {entity_id: $entity_id, part_signal_instrument: $part_signal_instrument, part_signal: $part_signal, machine_status_signal: $machine_status_signal, machine_status_signal_instrument: $machine_status_signal_instrument, planned_downtime: $planned_downtime, setup_time: $setup_time, enable_setup_time: $enable_setup_time, is_part_count_binary: $is_part_count_binary, above_oee_color: $above_oee_color, above_oee_value: $above_oee_value, below_oee_color: $below_oee_color, below_oee_value: $below_oee_value, between_oee_color: $between_oee_color, mic_stop_duration: $mic_stop_duration, is_status_signal_available: $is_status_signal_available, is_part_count_downfall: $is_part_count_downfall, min_mic_stop_duration: $min_mic_stop_duration, is_running_downtime:$is_running_downtime, is_standard_microstop: $is_standard_microstop}, on_conflict: {constraint: prod_asset_oee_config_un, update_columns: [part_signal_instrument, part_signal, machine_status_signal_instrument, machine_status_signal, planned_downtime, setup_time, enable_setup_time, is_part_count_binary, is_part_count_downfall, mic_stop_duration, is_status_signal_available, min_mic_stop_duration, above_oee_color, above_oee_value, below_oee_color, below_oee_value, between_oee_color, is_running_downtime]}) {
      id
    }
  }
  `,
  UpdateHierarchy: `
mutation UpdateHierarchy($name: String, $hierarchy: jsonb, $line_id: uuid, $user_id: uuid, $hier_id: uuid) {
  update_neo_skeleton_hierarchy(where: {id: {_eq: $hier_id}, _and: {line_id: {_eq: $line_id}}}, _set: {name: $name, hierarchy: $hierarchy, updated_by: $user_id}) {
    affected_rows
  }
}
`,
  CreateNewHierarchy: `
mutation CreateNewHierarchy($name: String, $hierarchy: jsonb, $line_id: uuid, $user_id: uuid) {
  insert_neo_skeleton_hierarchy_one(object: {name: $name, hierarchy: $hierarchy, line_id: $line_id, created_by: $user_id, updated_by: $user_id}) {
    id
  }
}
`,


DeleteHierarchy: `
mutation DeleteHierarchy($hier_id: [uuid!]) {
  UserLineDefaultHierarchy:delete_neo_skeleton_user_line_default_hierarchy(where: {hierarchy_id: {_in: $hier_id}}) {
    affected_rows
  }
  reportsHierarchy:delete_neo_skeleton_reports(where: {hierarchy_id: {_in: $hier_id}}) {
    affected_rows
  }
  delete_hierarchy: delete_neo_skeleton_hierarchy(where: {id: {_in: $hier_id}}) {
    affected_rows
  }
}
`,
deleteReportGeneration: `
mutation deleteReportGeneration($id: [uuid!]) {
  update_neo_skeleton_report_generation(where: {id: {_in: $id}}, _set: {disable: true}) {
    returning {
      id
    }
  }
}
`,
deleteReportGenHierarchy: `
mutation deleteReportGenHierarchy($report_id: [uuid!]) {
  delete_neo_skeleton_report_generation(where: { report_id: {_in: $report_id}}) {
    returning {
      id
    }
  }
}
`,
UpdateMetric:`
mutation UpdateMetric($metric_id: bigint, $instrument_type: bigint, $metric_datatype: Int, $metric_unit: Int, $name: String, $title: String, $type: Int) {
  update_neo_skeleton_metrics(where: {id: {_eq: $metric_id}}, _set: {instrument_type: $instrument_type, metric_datatype: $metric_datatype, metric_unit: $metric_unit, name: $name, title: $title, type: $type}) {
    affected_rows
  }
}
`,
  DeleteUserRoleLineAccess: `
mutation DeleteUserRoleLineAccess($line_id: uuid, $role_id: Int, $user_id: uuid) {
  delete_neo_skeleton_user_role_line(where: {line_id: {_eq: $line_id}, _and: {role_id: {_eq: $role_id}, _and: {user_id: {_eq: $user_id}}}}) {
    affected_rows
  }
}
`,
  submitAccessReq: `
mutation submitAccessReq($created_by: uuid, $line_id: uuid, $reject: Boolean = false, $approve: Boolean = false, $role_id: bigint) {
  insert_neo_skeleton_user_request_access(objects: {created_by: $created_by, line_id: $line_id, reject: $reject, approve: $approve, role_id: $role_id}) {
    affected_rows
    returning {
      id
    }
  }
}
`,
  deleteAccessRequest: `
mutation deleteAccessRequest($id: bigint) {
  delete_neo_skeleton_user_request_access(where: {id: {_eq: $id}}) {
    affected_rows
    returning {
      id
    }
  }
}

`,
  toReviewRequest: `
mutation toReviewRequest($approve: Boolean, $reject: Boolean, $reviewed_ts: timestamptz, $user_id: uuid, $reject_reason: String, $id: bigint) {
 update_neo_skeleton_user_request_access(where: {id: {_eq: $id}}, _set: {approve: $approve, reject: $reject, reject_reason: $reject_reason, reviewed_by: $user_id, reviewed_ts: $reviewed_ts, updated_by: $user_id}) {
   affected_rows
   returning {
     id
     approve
     reject
     reject_reason
     reviewed_by
     reviewed_ts
     role_id
     line_id
     created_by
   }
 }
}
`,
  createUserRoleLine: `
mutation createUserRoleLine($user_id: uuid, $role_id: Int, $line_id: uuid, $updated_by: uuid) {
 insert_neo_skeleton_user_role_line(objects: {line_id: $line_id, role_id: $role_id, user_id: $user_id, updated_by: $updated_by, created_by: $updated_by, disable: false}) {
   affected_rows
   returning {
     line_id
     role_id
     user_id
   }
 }
} 
`,
  updateReason: `  
  mutation updateReason($reason_id: bigint, $outage_id: uuid, $description: String,$reason_tags : _uuid ) {
    update_neo_skeleton_prod_outage(where: {id: {_eq: $outage_id}}, _set: {reason_id: $reason_id, comments: $description , reason_tags : $reason_tags}) {
      affected_rows
    }
  }
`,
  addMaintenanceLogs: `
mutation addMaintenanceLogs($entity_id: uuid, $line_id: uuid, $log: String, $created_by: uuid, $updated_by: uuid) {
  insert_neo_skeleton_maintenance_log(objects: {line_id: $line_id, entity_id: $entity_id, log: $log, created_by: $created_by, updated_by: $updated_by}) {
    affected_rows
    returning {
      id
      log
      entity {
        id
        name
      }
      line_id
      user{
        id
        name
      }
      created_ts
    }
  }
} 

`,
addMaintLogs: `
mutation addMaintLogs($entity_id: uuid, $line_id: uuid, $log: String, $created_by: uuid, $updated_by: uuid, $log_date: date = "") {
  insert_neo_skeleton_maintenance_log(objects: {line_id: $line_id, entity_id: $entity_id, created_by: $created_by, updated_by: $updated_by, log: $log, log_date: $log_date}) {
    affected_rows
    returning {
      id
      log
      entity {
        id
        name
      }
      line_id
      user {
        id
        name
      }
      created_ts
    }
  }
}
`,
updateMaintLogs: `  
mutation updateMaintLogs($id: uuid!, $log_date: date!, $log: String!) {
  update_neo_skeleton_maintenance_log(
    where: { id: { _eq: $id } },
    _set: { log_date: $log_date, log: $log }
  ) {
    affected_rows
  }
}
`,
deleteMaintLogs: `
mutation deleteMaintLogs($id: uuid) {
  delete_neo_skeleton_maintenance_log(where: {id: {_eq: $id}}) {
    affected_rows 
  }
}
`,
  addOutageWithoutOrderID: `mutation addOutages($start_dt: timestamptz, $end_dt: timestamptz, $entity_id: uuid, $reason_id: bigint,$comments: String, $user_id: uuid, $line_id: uuid,$reason_tags : _uuid) {
  insert_neo_skeleton_prod_outage_one(object: {start_dt: $start_dt, end_dt: $end_dt, entity_id: $entity_id, reason_id: $reason_id,comments: $comments, created_by: $user_id, updated_by: $user_id, line_id: $line_id , reason_tags : $reason_tags}) {
id
}
}
`,
  deleteDefects: `
  mutation deleteDefects($defect_id: uuid) {
    delete_neo_skeleton_prod_quality_defects(where: {id: {_eq: $defect_id}}) {
      affected_rows 
    }
  }
`,
  updateReport: `
 mutation updateReport($id: uuid, $aggreation: String, $custome_reports: Boolean = false, $description: String, $entity_ids: _uuid, $group_by: String, $instument_ids: _varchar, $metric_ids: _int4, $name: String, $updated_by: uuid, $hierarchy_id: uuid, $startsat: timetz, $public_access: Boolean, $send_mail: Boolean, $alert_channels: _text, $alert_users: _text, $config: jsonb, $instrument_list_from: Int, $group_aggregation: Boolean, $table_layout: Int, $user_access_list: jsonb) {
  update_neo_skeleton_reports(where: {id: {_eq: $id}}, _set: {aggreation: $aggreation, custome_reports: $custome_reports, description: $description, entity_ids: $entity_ids, group_by: $group_by, instument_ids: $instument_ids, metric_ids: $metric_ids, name: $name, updated_by: $updated_by, hierarchy_id: $hierarchy_id, startsat: $startsat, public_access: $public_access, send_mail: $send_mail, alert_channels: $alert_channels, alert_users: $alert_users, config: $config, instrument_list_from: $instrument_list_from, group_aggregation: $group_aggregation, table_layout: $table_layout, user_access_list: $user_access_list}) {
    affected_rows
    returning {
      id
    }
  }
}

  
`,
  insertReports: `
 mutation insertReports($name: String, $description: String, $custome_reports: Boolean = false, $metric_ids: _int4, $aggreation: String, $group_by: String, $created_by: uuid, $line_id: uuid, $hierarchy_id: uuid, $instument_ids: _varchar, $reports: jsonb = "{}", $entity_ids: _uuid, $startsat: timetz, $public_access: Boolean, $send_mail: Boolean, $alert_channels: _text, $alert_users: _text, $config: jsonb, $instrument_list_from: Int, $group_aggregation: Boolean, $table_layout: Int, $user_access_list: jsonb = "") {
  insert_neo_skeleton_reports(objects: {name: $name, description: $description, custome_reports: $custome_reports, metric_ids: $metric_ids, aggreation: $aggreation, group_by: $group_by, created_by: $created_by, line_id: $line_id, instument_ids: $instument_ids, reports: $reports, entity_ids: $entity_ids, hierarchy_id: $hierarchy_id, startsat: $startsat, public_access: $public_access, send_mail: $send_mail, alert_channels: $alert_channels, alert_users: $alert_users, config: $config, instrument_list_from: $instrument_list_from, group_aggregation: $group_aggregation, table_layout: $table_layout, user_access_list: $user_access_list}) {
    affected_rows
  }
}

  
`,

insertReportStar:`
mutation insertReportStar($line_id: uuid, $report_id: uuid, $user_id: uuid) {
  insert_neo_skeleton_reports_star_fav(objects: {line_id: $line_id, report_id: $report_id, user_id: $user_id}) {
    affected_rows
  }
}

`,

insertDashboardStar:`
mutation insertDashboardStar($line_id: uuid, $dashboard_id: uuid, $user_id: uuid) {
  insert_neo_skeleton_dashboard_star_fav(objects: {line_id: $line_id, dashboard_id: $dashboard_id, user_id: $user_id}) {
    affected_rows
  }
}

`,

updateReportStar:`

mutation updateReportStar($id: uuid, $line_id: uuid, $report_id: uuid, $user_id: uuid) {
  update_neo_skeleton_reports_star_fav(where: {id: {_eq: $id}}, _set: {line_id: $line_id, report_id: $report_id, user_id: $user_id}) {
    affected_rows
  }
}

`,

updateDashboardStar:`

mutation updateDashBoardStar($id: uuid, $line_id: uuid, $dashboard_id: uuid, $user_id: uuid) {
  update_neo_skeleton_dashboard_star_fav(where: {id: {_eq: $id}}, _set: {line_id: $line_id, dashboard_id: $dashboard_id, user_id: $user_id}) {
    affected_rows
  }
}

`,
deleteReportStar:`

mutation deleteReportStar($id: uuid) {
  delete_neo_skeleton_reports_star_fav(where: {report_id: {_eq: $id}}) {
    affected_rows
  }
}


`,

deleteDashboardStar:`

mutation deleteDashStar($id: uuid) {
  delete_neo_skeleton_dashboard_star_fav(where: {dashboard_id: {_eq: $id}}) {
    affected_rows
  }
}


`,

deleteWorkInitiations: `
mutation MyMutation($id: uuid) {
  delete_neo_skeleton_prod_exec(where: {id: {_eq: $id}}) {
    affected_rows
  }
}`,
  addReasonTag: `
mutation addReasonTag ($reason_tag:String,$user_id : uuid, $line_id : uuid , $reason_type : bigint){
  insert_neo_skeleton_prod_reason_tags_one(object: {reason_tag: $reason_tag , created_by : $user_id , updated_by : $user_id , line_id : $line_id , reason_type : $reason_type}){
    id
  }
}`,
AddBulkConnectivity:`
mutation AddBulkConnectivity($objects: [neo_skeleton_connectivity_insert_input!] = {}) {
  insert_neo_skeleton_connectivity(objects: $objects) {
    affected_rows
    returning {
      id,
      instrument_id
    }
  }
}
`,
AddConnectivity:`
mutation addConnectivity($alert_channels: _text, $alert_users: json, $delivery: json, $line_id: uuid, $instrument_id: String, $name: String, $created_by: uuid, $check_type: String, $check_last_n: Int) {
  insert_neo_skeleton_connectivity(objects: {alert_channels: $alert_channels, alert_users: $alert_users, created_by: $created_by, delivery: $delivery, instrument_id: $instrument_id, line_id: $line_id, name: $name, updated_by: $created_by, check_type: $check_type, check_last_n: $check_last_n}, on_conflict: {constraint: connectivity_pk, update_columns: [alert_channels,alert_users,delivery,instrument_id,name,check_type,check_last_n,updated_by]}) {
    affected_rows
    returning {
      id
    }
  }
}
`,
  updateConnectivity: `
mutation updateConnectivity($id: uuid, $name: String, $instrument_id: String, $check_last_n: Int, $check_type: String, $alert_users: json, $alert_channels: _text, $delivery: json, $updated_by: uuid, $connectivity_type:Int, $gateway_id:uuid) {
  update_neo_skeleton_connectivity(where: {id: {_eq: $id}}, _set: {name: $name, instrument_id: $instrument_id, alert_users: $alert_users, alert_channels: $alert_channels, check_last_n: $check_last_n, check_type: $check_type, delivery: $delivery, updated_by: $updated_by,connectivity_type: $connectivity_type, gateway_id: $gateway_id}) {
    affected_rows
    returning {
      id
    }
  }
}
`,
  deleteConnectivity: `
mutation deleteConnectivity($id: uuid) {
  delete_neo_skeleton_connectivity(where: {id: {_eq: $id}}) {
    affected_rows
    returning {
      id
    }
  }
}
`,
deleteInstrumentConnectivity: `
mutation deleteInstrumentConnectivity($instrument_id: String) {
  delete_neo_skeleton_connectivity(where: {instrument_id: {_eq: $instrument_id}}) {
    affected_rows
    returning {
      id
    }
  }
}
`,


  deleteOeeConfigofanAsset: `mutation deleteOeeConfigofanAsset($asset_id: uuid) {
    delete_neo_skeleton_prod_asset_oee_config(where: {entity_id: {_eq: $asset_id}}) {
      affected_rows
      returning {
        id
      }
    }
  }
  `,
addOrder: `
mutation addOrder($order_id: String, $line_id: uuid, $start_dt: timestamptz, $end_dt: timestamptz, $qty: String $product_id: uuid, $user_id: uuid , $delivery_date : timestamptz,$quantity_unit: Int) {
  insert_neo_skeleton_prod_order_one(object: {order_id: $order_id, start_dt: $start_dt, end_dt: $end_dt, qty: $qty, product_id: $product_id, updated_by: $user_id, created_by: $user_id, line_id: $line_id , delivery_date : $delivery_date,quantity_unit: $quantity_unit}) {
    id
  }
}
`,
editOrder :`
mutation editOrder($order_id: String, $start_dt: timestamptz, $end_dt: timestamptz, $qty: String, $product_id: uuid, $user_id: uuid, $id: uuid,$delivery_date : timestamptz,$quantity_unit: Int) {
  update_neo_skeleton_prod_order(where: {id: {_eq: $id}}, _set: {order_id: $order_id, start_dt: $start_dt, end_dt: $end_dt, qty: $qty, product_id: $product_id, updated_by: $user_id ,delivery_date : $delivery_date,quantity_unit: $quantity_unit }) {
    affected_rows
  }
}
`,
deleteWorkOrderWithRelations: `
  mutation deleteWorkOrderWithRelations($id: uuid) {
    downtime: delete_neo_skeleton_prod_outage(where: {order_id: {_eq: $id}}) {
      affected_rows
    }
    partComment: delete_neo_skeleton_prod_part_comments(where: {order_id: {_eq: $id}}) {
      affected_rows
    }
    qualityDefects: delete_neo_skeleton_prod_quality_defects(where: {order_id: {_eq: $id}}) {
      affected_rows
    }
    execution: delete_neo_skeleton_prod_exec(where: {order_id: {_eq: $id}}) {
      affected_rows
    }
    order: delete_neo_skeleton_prod_order(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
  `,
  addWorkExecution: `
mutation addWorkExecution($order_id: uuid, $line_id: uuid, $start_dt: timestamptz, $end_dt: timestamptz, $operator_id: uuid ,$entity_id: uuid, $user_id: uuid ,  $status : Int) {
  insert_neo_skeleton_prod_exec_one(object: {order_id: $order_id, start_dt: $start_dt, end_dt: $end_dt, operator_id: $operator_id, entity_id: $entity_id, updated_by: $user_id, created_by: $user_id, line_id: $line_id ,  status : $status }) {
    id
    }
    }
    `,
AddAnalyticConfig:`
mutation AddAnalyticConfig($entity_id: uuid, $config: jsonb) {
  insert_neo_skeleton_prod_asset_analytics_config(objects: {entity_id: $entity_id, config: $config}, on_conflict: {constraint: prod_asset_oee_config_un_1, update_columns: config}) {
    affected_rows
    returning {
      id
    }
  }
}
`,
DeleteAnalyticConfig:`
mutation DeleteAnalyticConfig($entity_id: [uuid!]) {
  delete_neo_skeleton_prod_asset_analytics_config(where: {entity_id: {_in: $entity_id}}) {
    affected_rows
    returning {
      id
      entity_id
    }
  }
}
`,

deleteProductWithRelations: `
mutation deleteProductWithRelations($order_id: [uuid!] , $product_id : uuid ) {
  downtime: delete_neo_skeleton_prod_outage(where: {order_id: {_in: $order_id}}) {
    affected_rows
  }
  partComment: delete_neo_skeleton_prod_part_comments(where: {order_id: {_in: $order_id}}) {
    affected_rows
  }
  qualityDefects: delete_neo_skeleton_prod_quality_defects(where: {order_id: {_in: $order_id}}) {
    affected_rows
  }
  execution: delete_neo_skeleton_prod_exec(where: {order_id: {_in: $order_id}}) {
    affected_rows
  }
  order :  delete_neo_skeleton_prod_order(where:{product_id: {_eq: $product_id}}) {
    affected_rows
  }
  product : delete_neo_skeleton_prod_products(where:{id: {_eq: $product_id}}) {
    affected_rows
  }
  
}
`,updateExecution:`
mutation updateExecution($id: uuid, $status: Int, $decline_reason: String ,$end_dt : timestamptz , $operator_id : uuid , $info : jsonb , $user_id : uuid , $start_dt : timestamptz) {
  update_neo_skeleton_prod_exec(where: {id:{_eq: $id}}, _set: {status: $status,decline_reason: $decline_reason , end_dt : $end_dt , start_dt : $start_dt , info : $info , updated_by : $user_id , operator_id : $operator_id}) {
   affected_rows
  }
}
`,

updateLastOpenedReport:`
mutation updateLastOpenedReport($id: uuid, $last_opened: timestamptz) {
  update_neo_skeleton_reports(where: {id: {_eq: $id}}, _set: {last_opened: $last_opened}) {
    affected_rows
  }
}

`,

updateLastOpenedDashboard:`
mutation updateLastOpenedDashboard($id: uuid, $last_opened: timestamptz) {
  update_neo_skeleton_dashboard (where: {id: {_eq: $id}}, _set: {last_opened: $last_opened}) {
    affected_rows
  }
}
`,



Addnewdashboard:`
mutation Addnewdashboard($user_id: uuid, $custom: Boolean, $dashboard: jsonb, $line_id: uuid, $name: String, $layout: jsonb, $standard: Boolean,$datepicker_type:String) {
  insert_neo_skeleton_dashboard(objects: {created_by: $user_id, custome_dashboard: $custom, standard: $standard, dashboard: $dashboard, line_id: $line_id, name: $name, updated_by: $user_id, layout: $layout,datepicker_type:$datepicker_type}) {
    affected_rows
    returning {
      id
      custome_dashboard
      standard
      line_id
      name
      datepicker_type
      updated_ts
      userByUpdatedBy {
        id
        name
        updated_ts
      }
      userByCreatedBy {
        id
        name
      }
    }
  }
}
`, 
UpdateDashboardName: `
mutation UpdateDashboardName($name: String, $dash_id: uuid, $user_id: uuid, $custom: Boolean, $standard: Boolean,$user_access_list:jsonb ,$datepicker_type:String) {
  update_neo_skeleton_dashboard(where: {id: {_eq: $dash_id}}, _set: {name: $name, updated_by: $user_id, custome_dashboard: $custom, standard: $standard,user_access_list:$user_access_list,datepicker_type:$datepicker_type}) {
    affected_rows
    returning {
      id
      custome_dashboard
      standard
      line_id
      name
      userByUpdatedBy {
        id
        name
      }
      userByCreatedBy {
        id
        name
      }
    }
  }
} 
`,
Updateusercurrdashboard: `
mutation Updateusercurrdashboard($user_id: uuid, $line_id: uuid, $dash_id: uuid) {
  insert_neo_skeleton_user_default_dashboard_one(object: {user_id: $user_id, line_id: $line_id, dashboard_id: $dash_id}, on_conflict: {constraint: user_default_dashboard_pk, update_columns: dashboard_id, where: {line_id: {_eq: $line_id}, user_id: {_eq: $user_id}}}) {
    dashboard {
      id
      name
      dashboard
      layout
    }
  }
}
`,
UpdateDashboardDATA: `
    mutation UpdateDashboardDATA($dash_id: uuid, $dashboard: jsonb, $user_id: uuid) {
      update_neo_skeleton_dashboard(where: {id: {_eq: $dash_id}}, _set: {dashboard: $dashboard, updated_by: $user_id}) {
        affected_rows
        returning {
          id
          dashboard
        }
      }
    }
  `,
  UpdateDashboardLAYOUT: `
    mutation UpdateDashboardLAYOUT($dash_id: uuid, $layout: jsonb, $user_id: uuid) {
      update_neo_skeleton_dashboard(where: {id: {_eq: $dash_id}}, _set: {layout: $layout, updated_by: $user_id}) {
        affected_rows
        returning {
          id
          layout
        }
      }
    }
  `,
  DeleteUserdefaultdashboard: `
  mutation DeleteUserdefaultdashboard($dashboard_id: uuid) {
  delete_neo_skeleton_user_default_dashboard(where: {dashboard_id: {_eq: $dashboard_id}}){
    affected_rows
  }
}
  `,
  DeleteDashboard: `
  mutation Deletedashboard($dashboard_id: uuid) {
    delete_neo_skeleton_dashboard(where: {id: {_eq: $dashboard_id}, line_id: {_is_null: false}}) {
      affected_rows
    }
  }
  
  `, 

  AddOrUpdateUserDefaultHierarchy: `
  mutation AddOrUpdateUserDefaultHierarchy($hier_id: uuid, $line_id: uuid, $user_id: uuid) {
    insert_neo_skeleton_user_line_default_hierarchy_one(object: {hierarchy_id: $hier_id, line_id: $line_id, user_id: $user_id, updated_by: $user_id, created_by: $user_id}, on_conflict: {constraint: user_line_default_hierarchy_user_id_line_id_primary_key, update_columns: hierarchy_id, where: {user_id: {_eq: $user_id}, _and: {line_id: {_eq: $line_id}}}}) {
      hierarchy_id
    }
  }  
  `,
  AddAssetInstrumentsMapping:`
  mutation AddAssetInstrumentsMapping($objects: [neo_skeleton_entity_instruments_insert_input!]! ) {
    insert_neo_skeleton_entity_instruments(objects: $objects) {
      affected_rows
    }
  }
  `,
  deleteAssetInstrumentsMapping:`
  mutation deleteAssetInstrumentsMapping($entity_id: uuid, $instrument_id: [String!]) {
    delete_neo_skeleton_entity_instruments(where: {entity_id: {_eq: $entity_id}, instrument_id: {_in: $instrument_id}}) {
      affected_rows
    }
  }
  `,
  deleteInstrumentsMapping:`
  mutation deleteInstrumentsMapping( $instrument_id: [String!]) {
    delete_neo_skeleton_entity_instruments(where: {instrument_id: {_in: $instrument_id}}) {
      affected_rows
    }
  }
  `,
  editDowntime: `
  mutation editDowntime($id: uuid, $start_dt: timestamptz, $end_dt: timestamptz, $reason_tags: _uuid, $reason_id: bigint, $comments: String) {
    update_neo_skeleton_prod_outage(where: {id: {_eq: $id}}, _set: {comments: $comments, end_dt: $end_dt, start_dt: $start_dt, reason_tags: $reason_tags, reason_id: $reason_id}) {
      affected_rows
      returning {
        id
      }
    }
  }
  `,
  addTask: `
  mutation AddTask($title: String, $type: Int, $priority: Int, $status: Int, $entity_id: uuid, $assingee: uuid, $description: String, $due_date: timestamptz, $created_by: uuid, $updated_by: uuid, $action_taken: uuid, $action_recommended: String, $comments: String, $action_taken_date: timestamptz, $observed_date: timestamptz, $observed_by: uuid, $reported_by: uuid, $instrument_id: String, $fault_mode: Int, $instrument_status_type_id: Int, $mcc_id: uuid = "", $scc_id: uuid = "", $reported_date: timestamptz = "") {
    insert_neo_skeleton_tasks_one(object: {title: $title, type: $type, priority: $priority, status: $status, entity_id: $entity_id, assingee: $assingee, description: $description, due_date: $due_date, created_by: $created_by, updated_by: $updated_by, action_taken: $action_taken, action_recommended: $action_recommended, comments: $comments, action_taken_date: $action_taken_date, observed_date: $observed_date, observed_by: $observed_by, reported_by: $reported_by, instrument_id: $instrument_id, fault_mode: $fault_mode, instrument_status_type_id: $instrument_status_type_id, mcc_id: $mcc_id, scc_id: $scc_id, reported_date: $reported_date}) {
      id
    }
  }
  `,
updateTask: `
mutation updateTask($taskid: uuid,$title: String, $type: Int, $priority: Int, $status: Int, $entity_id: uuid, $assingee: uuid, $description: String, $due_date: timestamptz, $updated_by: uuid,$action_taken: uuid,$action_recommended: String,$comments: String,$action_taken_date: timestamptz,$observed_date: timestamptz, $observed_by: uuid, $reported_by: uuid, $instrument_id: String, $fault_mode: Int, $instrument_status_type_id: Int, $mcc_id: uuid = "", $scc_id: uuid = "", $reported_date: timestamptz = "", $task_closed_by: uuid = null ) {
  update_neo_skeleton_tasks(where: {id: {_eq: $taskid}}, _set: {title: $title, type: $type, priority: $priority, status: $status, entity_id: $entity_id, assingee: $assingee, description: $description, due_date: $due_date, updated_by: $updated_by,action_taken: $action_taken,action_recommended: $action_recommended,comments: $comments,action_taken_date:$action_taken_date,observed_date:$observed_date,observed_by:$observed_by,reported_by:$reported_by,instrument_id:$instrument_id,fault_mode:$fault_mode, instrument_status_type_id:$instrument_status_type_id, mcc_id: $mcc_id, scc_id: $scc_id, reported_date: $reported_date, task_closed_by: $task_closed_by }) {
    affected_rows
  }
}
`,
updateTaskLastTime: `
mutation updateTaskLastTime($taskid: uuid ,$last_remainded_time: timestamptz) {
  update_neo_skeleton_tasks(where: {id: {_eq: $taskid}}, _set: {last_remainded_time : $last_remainded_time }) {
    affected_rows
  }
}
`,
addTaskType: `
mutation addTaskType($task_type: String) {
insert_neo_skeleton_task_types_one(object: {task_type: $task_type}) {
  id
}
}
`,
addTaskPriority: `
mutation addTaskPriority($task_level: String) {
insert_neo_skeleton_task_priority_one(object: {task_level: $task_level}) {
  id
}
}
`,
addTaskStatus: `
mutation addTaskStatus($status: String) {
insert_neo_skeleton_task_status_one(object: {status: $status}) {
  id
}
}
`,
deleteTask: `
mutation deleteTask($taskid: uuid) {
  delete_neo_skeleton_tasks_attachements(where: {task_id: {_eq: $taskid}}) {
    affected_rows
  }
  delete_neo_skeleton_tasks(where: {id: {_eq: $taskid}}) {
    affected_rows
  }
}
`,  
deleteTaskInstrument: `
mutation deleteTaskInstrument($instrument_id: [String!]) {
  
  delete_neo_skeleton_tasks(where: {instrument_id: {_in: $instrument_id}}) {
    affected_rows
  }
}
`, 
createAlarmNameAndDelivery:`
mutation createAlarmNameAndDelivery($alert_channels: _text , $alert_users: json, $delivery: json , $check_aggregate_window_function: String , $check_aggregate_window_time_range: String , $check_time: String , $check_time_offset: String , $check_start_time: String , $line_id: uuid , $insrument_metrics_id: Int , $critical_type: String , $critical_value: String, $warn_type: String, $warn_value: String,$critical_max_value: String, $critical_min_value: String, $warn_max_value: String, $warn_min_value: String, $name: String, $status: String, $updated_by: uuid , $created_by: uuid, $check_last_n: Int, $check_type: String, $misc : jsonb, $message: String, $is_prod_id_available: Boolean, $product_id: uuid,$entity_type:String, $viid: uuid,$time_slot_id:Int, $alert_multi_channels: json, $recurring_alarm: Boolean, $warn_frequency: String , $cri_frequency: String) {
  insert_neo_skeleton_alerts_v2(objects: {alert_channels: $alert_channels, alert_users: $alert_users, delivery: $delivery, check_aggregate_window_time_range: $check_aggregate_window_time_range, check_aggregate_window_function: $check_aggregate_window_function, check_time: $check_time, check_time_offset: $check_time_offset, check_start_time: $check_start_time, line_id: $line_id, insrument_metrics_id: $insrument_metrics_id, critical_type: $critical_type, critical_value: $critical_value, warn_type: $warn_type, warn_value: $warn_value, critical_max_value: $critical_max_value, critical_min_value: $critical_min_value, warn_max_value: $warn_max_value, warn_min_value: $warn_min_value, name: $name, status: $status, updated_by: $updated_by, created_by: $created_by, check_last_n: $check_last_n, check_type: $check_type, message: $message, is_prod_id_available: $is_prod_id_available, product_id: $product_id,entity_type:$entity_type, viid: $viid,time_slot_id:$time_slot_id, alert_multi_channels:$alert_multi_channels, recurring_alarm:$recurring_alarm, warn_frequency:$warn_frequency, misc : $misc, cri_frequency:$cri_frequency}) {
    affected_rows
    returning {
      id
    }
  }
}
`,
createMetricsGroup:`
mutation createMetricsGroup($grpname: String, $access: String, $metrics: json, $updated_by: uuid, $created_by: uuid, $updated_ts: timestamptz, $shared_users: json, $group_limit: Boolean, $line_id: uuid, $lower_limit: Int, $upper_limit: Int) {
  insert_neo_skeleton_metrics_group(objects: {grpname: $grpname, metrics: $metrics, updated_by: $updated_by, created_by: $created_by, updated_ts: $updated_ts, shared_users: $shared_users, group_limit: $group_limit, line_id: $line_id, lower_limit: $lower_limit, upper_limit: $upper_limit, access: $access}) {
    affected_rows
    returning {
      id
      grpname
    }
  }
}
`,
deleteMetricsGroup:`
mutation deleteMetricsGroup($id: [uuid!]) {
  delete_neo_skeleton_metrics_group(where: {id: {_in: $id}}) {
    affected_rows
     returning {
      id
      grpname
    }
  }
}
`,
updateMetricsGroup:`
mutation updateMetricsGroup($id: uuid!,$grpname: String, $access: String, $metrics: json, $updated_by: uuid, $updated_ts: timestamptz, $shared_users: json, $group_limit: Boolean, $line_id: uuid, $lower_limit: Int, $upper_limit: Int) {
  update_neo_skeleton_metrics_group(where: {id: {_eq: $id}}, _set: {grpname: $grpname, metrics: $metrics, updated_by: $updated_by, updated_ts: $updated_ts, shared_users: $shared_users, group_limit: $group_limit, line_id: $line_id, lower_limit: $lower_limit, upper_limit: $upper_limit, access: $access}) {
    affected_rows
    returning {
      id
      grpname
    }
  }
}
`,
updateAlarmNameAndDelivery:`
mutation updateAlarmNameAndDelivery($alert_id: uuid, $name: String, $delivery: json ,$alert_channels: _text ,$alert_users: json, $check_aggregate_window_function: String, $check_aggregate_window_time_range: String, $insrument_metrics_id: Int, $critical_type: String, $critical_value: String, $warn_type: String, $warn_value: String, $critical_max_value: String, $critical_min_value: String, $warn_max_value: String, $warn_min_value: String, $updated_by: uuid, $check_last_n: Int, $check_type: String, $message: String, $is_prod_id_available: Boolean, $product_id: uuid,$entity_type:String,$viid:uuid,$time_slot_id:Int, $alert_multi_channels: json , $misc : jsonb ,$recurring_alarm: Boolean, $warn_frequency: String , $cri_frequency: String) {
  update_neo_skeleton_alerts_v2(where: {id: {_eq: $alert_id}}, _set: {name: $name, delivery: $delivery, alert_channels: $alert_channels, alert_users: $alert_users, check_aggregate_window_function: $check_aggregate_window_function, check_aggregate_window_time_range: $check_aggregate_window_time_range, insrument_metrics_id: $insrument_metrics_id, critical_type: $critical_type, critical_value: $critical_value, warn_type: $warn_type, warn_value: $warn_value, critical_max_value: $critical_max_value, critical_min_value: $critical_min_value, warn_max_value: $warn_max_value, warn_min_value: $warn_min_value, updated_by: $updated_by, check_last_n: $check_last_n, check_type: $check_type, message: $message, is_prod_id_available: $is_prod_id_available, product_id: $product_id,entity_type:$entity_type,viid:$viid,time_slot_id:$time_slot_id, alert_multi_channels: $alert_multi_channels , misc : $misc, recurring_alarm:$recurring_alarm, warn_frequency:$warn_frequency, cri_frequency:$cri_frequency}) {
    affected_rows
    returning {
      id
    }
  }
}
`,
updateAlarmConfig:`
mutation updateAlarmConfig($alert_id: uuid, $check_aggregate_window_time_range: String, $last_state: String, $current_state: String) {
  update_neo_skeleton_alerts_v2(where: {id: {_eq: $alert_id}}, _set: {check_aggregate_window_time_range: $check_aggregate_window_time_range , last_state: $last_state, current_state: $current_state}) {
    affected_rows
    returning {
      id
    }
  }
}
`,
updateAlarmConfig:`
mutation updateAlarmConfig($alert_id: uuid, $check_aggregate_window_time_range: String, $last_state: String, $current_state: String) {
  update_neo_skeleton_alerts_v2(where: {id: {_eq: $alert_id}}, _set: {check_aggregate_window_time_range: $check_aggregate_window_time_range , last_state: $last_state, current_state: $current_state}) {
    affected_rows
    returning {
      id
    }
  }
}
`,
Addnewsensor: `
  mutation AddNewsensor($iid: String, $number: String, $tech_id: String, $tech_name: String, $axis: String, $db_name: String, $vfd: Boolean, $rpm: float8, $min_rpm: float8, $max_rpm: float8, $location: String, $type: Int, $intermediate: Int, $domain: String, $order: jsonb, $updated_by: uuid) {
    insert_neo_skeleton_sensors(objects: {iid: $iid, number: $number, tech_id: $tech_id, tech_name: $tech_name, db_name: $db_name, vfd: $vfd, rpm: $rpm, min_rpm: $min_rpm, max_rpm: $max_rpm, location: $location, type: $type, intermediate: $intermediate, domain: $domain, axis: $axis, order: $order, updated_by: $updated_by}) {
      returning {
        iid
      }
    }
  }
  `,
  UpdateSensor: `
   mutation UpdateSensor($iid: String, $number: String, $tech_id: String, $tech_name: String, $axis: String, $db_name: String, $vfd: Boolean, $rpm: float8, $min_rpm: float8, $max_rpm: float8, $location: String, $type: Int, $intermediate: Int, $domain: String, $order: jsonb, $updated_by: uuid, $id: uuid){
   update_neo_skeleton_sensors(where: {id: {_eq: $id}}, _set: {iid: $iid, number: $number, tech_id: $tech_id, tech_name: $tech_name, db_name: $db_name, vfd: $vfd, rpm: $rpm, min_rpm: $min_rpm, max_rpm: $max_rpm, location: $location, type: $type, intermediate: $intermediate, domain: $domain, axis: $axis, order: $order, updated_by: $updated_by}){
     returning {
        iid
      }
   }
  }
  `,
  UpdateAllSensor: `
  mutation UpdateSensor($iid: String, $db_name: String, $vfd: Boolean, $rpm: float8, $min_rpm: float8, $max_rpm: float8, $location: String, $type: Int, $intermediate: Int, $domain: String, $order: jsonb, $updated_by: uuid){
  update_neo_skeleton_sensors(where: {iid: {_eq: $iid}}, _set: {db_name: $db_name, vfd: $vfd, rpm: $rpm, min_rpm: $min_rpm, max_rpm: $max_rpm, location: $location, type: $type, intermediate: $intermediate, domain: $domain,order: $order, updated_by: $updated_by}){
    returning {
       iid
     }
  }
 }
 `,
  UpdateSensorEnabled: `
 mutation UpdateSensorEnabled($enable: Boolean, $updated_by: uuid, $id: uuid) {
  update_neo_skeleton_sensors(
    where: {id: {_eq: $id}},
    _set: {enable: $enable, updated_by: $updated_by}
  ) {
    returning {
      iid
    }
  }
}
 `,
  Addnewannotation: `
  mutation Addnewannotation($schema: String, $date: timestamptz, $value: String, $metric_key: String, $instrument_id: String, $comments: String, $line_id: uuid, $user_id: uuid) {
    insert_neo_skeleton_data_annotations(objects: {schema: $schema, date: $date, value: $value, metric_key: $metric_key, instrument_id: $instrument_id, comments: $comments, line_id: $line_id, updated_by: $user_id, created_by: $user_id}) {
      affected_rows
      returning {
        id
      }
    }
  }
  `,
  Updateannotation: `
  mutation Updateannotation($date: timestamptz, $metric_key: String, $instrument_id: String, $comments: String,$line_id:uuid,$schema:String) {
    update_neo_skeleton_data_annotations(where: {date: {_eq: $date}, _and: {metric_key: {_eq:$metric_key}, _and: {instrument_id: {_eq: $instrument_id},_and: {line_id: {_eq:$line_id},_and: {schema: {_eq:$schema}}}}}}, _set: {comments: $comments}){
      affected_rows
    }
  }
  `,
  deleteAlarmRule:`
  mutation deleteAlarmRule($id: [uuid!]) {
    delete_neo_skeleton_alerts_v2(where: {id: {_in: $id}}) {
      affected_rows
    }
  }
  `,
  deleteProductId:`
  mutation deleteProductId($product_id: [uuid!]) {
    delete_neo_skeleton_alerts_v2(where: {product_id: {_in: $product_id}}) {
      affected_rows
    }
  }
  `,
  UpdateChildLine:`
  mutation UpdateChildLine($parent_line_id: uuid, $child_line_ids: _uuid) {
    update_neo_skeleton_lines_hierarchy(where: {parent_line_id: {_eq: $parent_line_id}}, _set: {child_line_ids: $child_line_ids}) {
      affected_rows
    }
  }
  `,
  UpdateMetricScalingFactor:`
  mutation UpdateMetricScalingFactor($instruments_id: String, $metrics_id: bigint, $factor: Float, $calibrate: numeric,$enable_forecast:Boolean) {
    update_neo_skeleton_instruments_metrics(where: {instruments_id: {_eq: $instruments_id}, _and: {metrics_id: {_eq: $metrics_id}}}, _set: {calibrate: $calibrate, factor: $factor,enable_forecast:$enable_forecast}) {
      affected_rows  
      returning {
        metric_id
      }
    }
  }
  `, 
  addQualityDefectsWithoutOrderID: `
  mutation addQualityDefectsWithoutOrderID($objects: [neo_skeleton_prod_quality_defects_insert_input!]!) {
    insert_neo_skeleton_prod_quality_defects(
      objects: $objects,
      on_conflict: {constraint: prod_quality_defects_pk, update_columns: []}
    ) {
      returning {
        id
      }
    }
  }
  `,
  AddDryerConfig:`
  mutation AddDryerConfig($is_enable: Boolean, $entity_id: uuid, $line_id: uuid, $gas_energy_consumption_instrument: String, $gas_energy_consumption: Int, $electrical_energy_consumption_instrument: String, $electrical_energy_consumption1: Int, $moisture_input_instrument: String, $moisture_input: Int, $moisture_output_instrument: String, $moisture_output: Int, $total_sand_dried_instrument: String, $total_sand_dried: Int, $total_sand_fed_instrument: String, $total_sand_fed: Int, $total_scrap_instrument: String, $total_scrap: Int, $total_shutdown_time_instrument: String, $total_shutdown_time: Int, $total_startup_time_instrument: String, $total_startup_time: Int, $empty_run_time_instrument: String, $empty_run_time: Int) {
    insert_neo_skeleton_dryer_config(objects: {entity_id: $entity_id, is_enable: $is_enable, line_id: $line_id, gas_energy_consumption_instrument: $gas_energy_consumption_instrument, gas_energy_consumption: $gas_energy_consumption, electrical_energy_consumption_instrument: $electrical_energy_consumption_instrument, electrical_energy_consumption: $electrical_energy_consumption1, moisture_input_instrument: $moisture_input_instrument, moisture_input: $moisture_input, moisture_output_instrument: $moisture_output_instrument, moisture_output: $moisture_output, total_sand_dried_instrument: $total_sand_dried_instrument, total_sand_dried: $total_sand_dried, total_sand_fed_instrument: $total_sand_fed_instrument, total_sand_fed: $total_sand_fed, total_scrap_instrument: $total_scrap_instrument, total_scrap: $total_scrap, total_shutdown_time_instrument: $total_shutdown_time_instrument, total_shutdown_time: $total_shutdown_time, total_startup_time_instrument: $total_startup_time_instrument, total_startup_time: $total_startup_time, empty_run_time_instrument: $empty_run_time_instrument, empty_run_time: $empty_run_time}) {
      affected_rows
      returning {
        id
      }
    }
  }
  `,
  UpdateDryerConfig:`
  mutation UpdateDryerConfig($entity_id: uuid, $is_enable: Boolean, $gas_energy_consumption_instrument: String, $gas_energy_consumption: Int, $electrical_energy_consumption_instrument: String, $electrical_energy_consumption1: Int, $moisture_input_instrument: String, $moisture_input: Int, $moisture_output_instrument: String, $moisture_output: Int, $total_sand_dried_instrument: String, $total_sand_dried: Int, $total_sand_fed_instrument: String, $total_sand_fed: Int, $total_scrap_instrument: String, $total_scrap: Int, $total_shutdown_time_instrument: String, $total_shutdown_time: Int, $total_startup_time_instrument: String, $total_startup_time: Int, $empty_run_time_instrument: String, $empty_run_time: Int) {
    update_neo_skeleton_dryer_config(where: {entity_id: {_eq: $entity_id}}, _set: {is_enable: $is_enable, gas_energy_consumption_instrument: $gas_energy_consumption_instrument, gas_energy_consumption: $gas_energy_consumption, electrical_energy_consumption_instrument: $electrical_energy_consumption_instrument, electrical_energy_consumption: $electrical_energy_consumption1, moisture_input_instrument: $moisture_input_instrument, moisture_input: $moisture_input, moisture_output_instrument: $moisture_output_instrument, moisture_output: $moisture_output, total_sand_dried_instrument: $total_sand_dried_instrument, total_sand_dried: $total_sand_dried, total_sand_fed_instrument: $total_sand_fed_instrument, total_sand_fed: $total_sand_fed, total_scrap_instrument: $total_scrap_instrument, total_scrap: $total_scrap, total_shutdown_time_instrument: $total_shutdown_time_instrument, total_shutdown_time: $total_shutdown_time, total_startup_time_instrument: $total_startup_time_instrument, total_startup_time: $total_startup_time, empty_run_time_instrument: $empty_run_time_instrument, empty_run_time: $empty_run_time}) {
      affected_rows
      returning {
        id
      } 
    }
  }`,
  delForecastMetrics: `
   mutation delete_neo_skeleton_instruments_metrics_forecasting($ins_met_is: [Int!]) {
      delete_neo_skeleton_instruments_metrics_forecasting(where: {ins_met_is: {_in: $ins_met_is}}) {
        affected_rows
      }
    }
  `,
  addSteelAssetConfig: `
  mutation AddSteelAssetConfig($entity_id: uuid, $product_id: Int, $line_id: uuid, $form_layout: json, $user_id: uuid) {
    insert_neo_skeleton_steel_asset_config_one(object: {entity_id: $entity_id, line_id: $line_id, steel_product_id: $product_id, form_layout: $form_layout, created_by: $user_id}) {
      id
    }
  }
  `,
  deleteSteelAssetConfig: `
  mutation deleteSteelAssetConfig($id: uuid) {
    delete_neo_skeleton_steel_asset_config(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
  `,
  updateSteelAssetConfigCalculation: `
  mutation MyMutation2($calculations: json, $id: uuid) {
    update_neo_skeleton_steel_asset_config(where: {id: {_eq: $id}}, _set: {calculations: $calculations}) {
      affected_rows
    }
  }
  `,
  updateSteelAssetConfig:`
  mutation updateSteelAssetConfig($entity_id: uuid, $product_id: Int, $line_id: uuid,$form_layout: json, $user_id: uuid, $id: uuid) {
    update_neo_skeleton_steel_asset_config(where: {id: {_eq: $id}}, _set: {entity_id: $entity_id, line_id: $line_id, steel_product_id: $product_id, form_layout: $form_layout, updated_by: $user_id}) {
      affected_rows
    }
  }
  `
,
  createGateWay : `
 mutation createGateWay($iid: String, $instrument_id: jsonb, $ip_address: String, $line_id: uuid, $location: String, $name: String, $created_by: uuid, $gateway_instrument: String , $end_point_url: String ) {
  insert_neo_skeleton_gateway(objects: {iid: $iid, instrument_id: $instrument_id, ip_address: $ip_address, line_id: $line_id, location: $location, name: $name, created_by: $created_by, end_point_url: $end_point_url, gateway_instrument: $gateway_instrument}) {
    affected_rows
    returning {
      id
    }
  }
}
  
  `,
  updateGateWay:`
  mutation updateGateWay($id: uuid, $iid: String, $instrument_id: jsonb, $ip_address: String, $line_id: uuid, $location: String, $name: String, $updated_by: uuid, $end_point_url: String , $gateway_instrument: String) {
  update_neo_skeleton_gateway(where: {id: {_eq: $id}}, _set: {iid: $iid, instrument_id: $instrument_id, ip_address: $ip_address, line_id: $line_id, location: $location, name: $name, updated_by: $updated_by, end_point_url: $end_point_url, gateway_instrument: $gateway_instrument}) {
    affected_rows
    returning {
      id
    }
  }
}

  
  `
  ,
  createGatewayInstrumentConfig:`
 mutation createGatewayInstrumentConfig($com_setting_id: String, $created_by: uuid, $en_dis: String, $gateway_id: uuid, $instrument_id: String, $model: String, $model_number_id: String, $slave_id: Int, $make: String, $mqtt_id: Int) {
  insert_neo_skeleton_gateway_instruments(objects: {com_setting_id: $com_setting_id, created_by: $created_by, en_dis: $en_dis, gateway_id: $gateway_id, instrument_id: $instrument_id, make: $make, model: $model, model_number_id: $model_number_id, slave_id: $slave_id, mqtt_id: $mqtt_id}) {
    affected_rows
  }
}

  `,

  updateGatewayInstrumentConfig:`
  mutation updateGatewayInstrumentConfig($gateway_id: uuid, $instrument_id: String, $com_setting_id: String, $en_dis: String,  $make: String, $model: String, $model_number_id: String, $slave_id: Int, $updated_by: uuid, $mqtt_id: Int) {
  update_neo_skeleton_gateway_instruments(where: {gateway_id: {_eq: $gateway_id}, instrument_id: {_eq: $instrument_id}}, _set: {com_setting_id: $com_setting_id, en_dis: $en_dis, make: $make, model: $model, model_number_id: $model_number_id, slave_id: $slave_id, updated_by: $updated_by, mqtt_id: $mqtt_id}) {
    affected_rows
  }
}



  `,
  DeleteGateWay:`
  mutation deleteGateWay($id: uuid) {
    delete_neo_skeleton_gateway(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
  
  `,
  addAlarmAcknowledgement:`
  mutation addAlarmAcknowledgement($name: String, $type: String, $line_id: uuid, $created_by: uuid) {
    insert_neo_skeleton_alarm_acknowledgement(objects: {name: $name, type: $type, line_id: $line_id, created_by: $created_by}) {
      affected_rows
      returning {
        id
      }
    }
  }`,

  addFaultAcknowledgement:`
  mutation addFaultAcknowledgement($name: String, $line_id: uuid, $created_by: uuid) {
    insert_neo_skeleton_fault_acknowledgement(objects: {name: $name, line_id: $line_id, created_by: $created_by}) {
      affected_rows
      returning {
        id
      }
    }
  }`
  ,
  addProdOperator:`
  mutation addProdOperator($entity_id: uuid, $operator_id: uuid, $start: timestamptz, $updated_by: uuid, $end: timestamptz, $created_by: uuid) {
    insert_neo_skeleton_prod_operator(objects: {entity_id: $entity_id, operator_id: $operator_id, start: $start, updated_by: $updated_by, end: $end,created_by:$created_by}) {
      returning {
        operator_id
        start
        end
      }
    }
  }
  
  
  `
,
  UpdateProdOperator:`
  mutation UpdateProdOperator($id: uuid, $operator_id: uuid, $updated_by: uuid) {
    update_neo_skeleton_prod_operator(where: {id: {_eq: $id}}, _set: {operator_id: $operator_id, updated_by: $updated_by}) {
      returning {
        operator_id
        start
        end
      }
    }
  }
  `,
  addCalendarReport :`
  mutation addCalendarReport($created_by: uuid, $updated_by: uuid, $report_type: numeric, $path_name: String, $entity_id: uuid, $upload_date: timestamp,$line_id: uuid) {
    insert_neo_skeleton_calendar_report(objects: {created_by: $created_by, updated_by: $updated_by, report_type: $report_type, path_name: $path_name, entity_id: $entity_id, upload_date: $upload_date,line_id:$line_id}) {
      returning {
        id
      }
    }
  }
  `,
  updateCalendarReport:`
  mutation updateCalendarReport($id: uuid, $path_name: String, $updated_by: uuid) {
    update_neo_skeleton_calendar_report(where: {id: {_eq: $id}}, _set: {path_name: $path_name, updated_by: $updated_by}) {
      affected_rows
    }
  }
  
  `,
  DeleteCalendarReport: `
  mutation DeleteCalendarReport($id: uuid) {
    delete_neo_skeleton_calendar_report(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
  
  `,
  AddnewScadaView: `
mutation AddnewScadaView($user_id: uuid, $data: jsonb, $line_id: uuid, $name: String, $standard: Boolean, $access_type: Int,$scada_user_access_list: jsonb) {
  insert_neo_skeleton_scada_dashboard(objects: {created_by: $user_id, standard: $standard, data: $data, line_id: $line_id, name: $name, updated_by: $user_id, access_type:$access_type, scada_user_access_list:$scada_user_access_list}) {
    affected_rows
    returning {
      id
      standard
      data
      line_id
      name
      updated_ts
      access_type
      scada_user_access_list
      userByUpdatedBy {
        id
        name
        updated_ts
      }
      userByCreatedBy {
        id
        name
      }
    }
  }
}

`,
  UpdateScadaViewName: `
mutation UpdateScadaViewName($name: String, $scada_id: uuid, $user_id: uuid, $standard: Boolean ) {
  update_neo_skeleton_scada_dashboard(where: {id: {_eq: $scada_id}}, _set: {name: $name, updated_by: $user_id, standard: $standard}) {
    affected_rows
    returning {
      id
      standard
      line_id
      data
      name
      userByUpdatedBy {
        id
        name
      }
      userByCreatedBy {
        id
        name
      }
    }
  }
}
`,
  DeleteUserdefaultScadaView: `
mutation DeleteUserdefaultScadaView($scada_id: uuid) {
delete_neo_skeleton_user_default_scada_dashboard(where: {scada_id: {_eq: $scada_id}}){
  affected_rows
}
}
`,
  DeleteScadaView: `
mutation DeleteScadaView($scada_id: uuid) {
  delete_neo_skeleton_scada_dashboard(where: {id: {_eq: $scada_id}, line_id: {_is_null: false}}) {
   affected_rows
  }
}`,
DeleteScadaViewbyuserid:`
mutation DeleteScadaViewbyuserid($scada_id: uuid, $user_id: uuid) {
  delete_neo_skeleton_scada_dashboard(where: {id: {_eq: $scada_id}, created_by: {_eq: $user_id}}) {
    affected_rows
  }
}`,
Deletefavstardashborad:`
mutation Deletefavstardashborad($line_id: uuid , $scada_id: uuid , $user_id: uuid ) {
  delete_neo_skeleton_scada_dash_star_fav(where: {line_id: {_eq: $line_id}, scada_id: {_eq: $scada_id}, user_id: {_eq: $user_id}}) {
    affected_rows
  }
}`,
  insertNodeMapedAsset:`
  mutation insertNodeMapedAsset($asset_id: jsonb, $entity_id: uuid) {
  insert_neo_skeleton_node_zone_mapping(objects: {asset_id: $asset_id, entity_id: $entity_id}) {
    returning {
      id
    }
    affected_rows
  }
}`,

UpdateScadaNameandAccess:`
mutation UpdateScadaNameandAccess($scada_id: uuid, $scada_user_access_list: jsonb, $updated_by: uuid, $access_type: Int, $name: String) {
  update_neo_skeleton_scada_dashboard(where: {id: {_eq: $scada_id}}, _set: {name: $name, scada_user_access_list: $scada_user_access_list, updated_by: $updated_by, access_type: $access_type}) {
    affected_rows
    returning {
      access_type
      id
      name
      scada_user_access_list
      updated_by
    }
  }
}`,


  Updateusercurrscada: `
mutation Updateusercurrscada($user_id: uuid, $line_id: uuid, $scada_id: uuid) {
  insert_neo_skeleton_user_default_scada_dashboard_one(object: {user_id: $user_id, line_id: $line_id, scada_id: $scada_id}, on_conflict: {constraint: user_default_scada_dashboard_pk, update_columns: scada_id, where: {line_id: {_eq: $line_id}, user_id: {_eq: $user_id}}}) {
    scada_dashboard {
      id
      name
      data
    }
  }
}
`,
  updateScadaData: `
mutation updateScadaData($scada_id: uuid, $data: jsonb, $user_id: uuid) {
  update_neo_skeleton_scada_dashboard(where: {id: {_eq: $scada_id}}, _set: {data: $data, updated_by: $user_id}) {
    affected_rows
    returning {
      id
      data
    }
  }
}
`,
scada_image: `
mutation scada_image($image_name: String, $line_id: uuid) {
  insert_neo_skeleton_scada_attachment(objects: {image_name: $image_name, line_id: $line_id}) {
    returning {
      id
      image_name
      line_id
    }
  }
}
`,
delete_ScadaImage: `
mutation delete_ScadaImage($id: uuid ) {
  delete_neo_skeleton_scada_attachment(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`,
UpdateModuleAndSubModuleVisibility:`
mutation UpdateModuleAndSubModuleVisibility( $line_id: uuid) {
  update_neo_skeleton_module_access(
    where: {line_id: {_eq: $line_id}},
    _set: {is_visible: false}
  ) {
    affected_rows
  }

  update_neo_skeleton_sub_module_access(
    where: {line_id: {_eq: $line_id}},
    _set: {is_visible: false}
  ) {
    affected_rows
  }
}


`,

UpdatedModuleAndSubModuleVisibility:
` mutation UpdatedModuleAndSubModuleVisibility (
  
  $line_id: uuid!,
  $module_ids: [Int!],
  $sub_module_ids: [uuid!]

  
) {
  update_neo_skeleton_module_access(
    where: {
      module_id: {_in: $module_ids},
      line_id: {_eq: $line_id}
    },
    _set: {is_visible: true}
  ) {
    affected_rows
  }

update_neo_skeleton_sub_module_access(
  where: {
    sub_module_id: {_in: $sub_module_ids},
    line_id: {_eq: $line_id}
  },
  _set: {is_visible: true}
) {
  affected_rows
}
} 
`,

UpdatedModuleAndSubModuleNotVisibility:
` mutation UpdatedModuleAndSubModuleNotVisibility (
  $line_id: uuid!,
  $module_ids: [Int!],
  $sub_module_ids: [uuid!]
  
) {
  update_neo_skeleton_module_access(
    where: {
      module_id: {_in: $module_ids},
      line_id: {_eq: $line_id}
    },
    _set: {is_visible: false}
  ) {
    affected_rows
  }
  update_neo_skeleton_sub_module_access(
    where: {
      sub_module_id: {_in: $sub_module_ids},
      line_id: {_eq: $line_id}
    },
    _set: {is_visible: false}
  ) {
    affected_rows
  }
} 
`,



  WOStopExecution: `
  mutation WOStopExecution($id: uuid , $end_dt: timestamptz,$status: Int ) {
    update_neo_skeleton_prod_exec(where: {id: {_eq: $id}}, _set: {end_dt: $end_dt,status: $status}) {  
      affected_rows
    }
  }
  `,
  OfflineProductInsert: `
  mutation OfflineProductInsert($asset_id: uuid, $created_by: uuid, $form_name: String, $frequency: Int, $product_id: uuid, $line_id: uuid, $updated_by: uuid, $isdelete: Boolean = false) {
    insert_neo_skeleton_production_form(objects: {asset_id: $asset_id, created_by: $created_by, form_name: $form_name, frequency: $frequency, line_id: $line_id, product_id: $product_id, updated_by: $updated_by, isdelete: $isdelete}) {
      affected_rows
    }
  }`,

  OfflineProductUpdate: `
  mutation OfflineProductUpdate($id: uuid, $form_name: String, $updated_by: uuid) {
    update_neo_skeleton_production_form(where: {id: {_eq: $id}}, _set: {form_name: $form_name, updated_by: $updated_by}) {
      affected_rows
    }
  }
  
  `,

  OfflineProductDelete:`
  mutation OfflineProductDelete($id: uuid) {
    delete_neo_skeleton_production_form(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
  `,
  updateNodeMapedAsset:`
  mutation updateNodeMapedAsset($id: Int, $asset_id: jsonb, $entity_id: uuid) {
  update_neo_skeleton_node_zone_mapping(where: {id: {_eq: $id}}, _set: {asset_id: $asset_id, entity_id: $entity_id}) {
  affected_rows
    returning {
      id
    }
  }
}
`,

 UpdateProductExec:`
 mutation UpdateProductExec( $info: jsonb,$id: uuid) {
  update_neo_skeleton_prod_exec(
    where: {id: {_eq: $id}},
    _set: {
      info: $info
    }
  ) {
    affected_rows
  }
}
 `,

 UpdateProductExecSpeci:`
 mutation UpdateProductExecSpeci( $info: jsonb,$id: uuid) {
  update_neo_skeleton_prod_exec(
    where: {id: {_eq: $id}},
    _set: {
      info: $info
    }
  ) {
    affected_rows
  }
}
 `,

 DeleteProductExec:`
 mutation DeleteProductExec($id: uuid ) {
  delete_neo_skeleton_prod_exec(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`,
ScadadashboardSharedUser:`
mutation ScadadashboardSharedUser($line_id: uuid!, $user_id: uuid!, $scada_id: uuid!) {
  insert_neo_skeleton_scada_dashboard_shared_user(objects: { line_id: $line_id, user_id: $user_id, scada_id: $scada_id }) {
    affected_rows
    returning {
      id
      line_id
      user_id
      scada_id
    }
  }
`,
AddUserToScadaViewRelation: `
mutation AddUserToScadaViewRelation($user_id: uuid, $line_id: uuid, $scada_id: uuid) {
  insert_neo_skeleton_scada_dashobard_shared_user(objects: {line_id: $user_id, scada_id: $line_id, user_id: $scada_id}) {
    affected_rows
    returning {
      id
      line_id
      scada_id
      user_id
}
}
}
`,
AddToolLife:`
mutation AddToolLife($name: String , $asset_types: Int , $intruments: jsonb , $limit: String ,  $created_by: uuid , $line_id: uuid, $limit_ts: String) {
  insert_neo_skeleton_tool_life(objects: {asset_types: $asset_types, created_by: $created_by, intruments: $intruments, limit: $limit, line_id: $line_id, name: $name, limit_ts :$limit_ts}, on_conflict: {constraint: tool_life_pkey, update_columns: [asset_types, name, intruments,limit,limit_ts]}) {
    affected_rows
    returning {
      id
    }
  }
}
`,
UpdateTool:`
mutation UpdateTool($id: uuid, $name: String, $intruments: jsonb, $asset_types: Int, $limit: String, $updated_by: uuid, $reset_ts: timestamptz, $limit_ts: String, ) {
  update_neo_skeleton_tool_life(where: {id: {_eq: $id}}, _set: {intruments: $intruments, asset_types: $asset_types, limit: $limit, name: $name, updated_by: $updated_by, reset_ts: $reset_ts, limit_ts: $limit_ts}) {
    affected_rows
  }
}
`,
DeleteTool:`
mutation DeleteTool($id: uuid) {
  delete_neo_skeleton_tool_life(where: {id: {_eq: $id}}) {
    affected_rows
    returning {
      name
    }
  }
}
`,
AddScadaFavouriteDash:`
mutation AddScadaFavouriteDash($line_id: uuid, $scada_id: uuid, $user_id: uuid) {
  insert_neo_skeleton_scada_dash_star_fav(objects: {line_id: $line_id, scada_id: $scada_id, user_id: $user_id}) {
    returning {
      line_id
      scada_id
      user_id
    }
    affected_rows
  }
}

`,
RemoveScadaFavouriteDash:`

mutation RemoveScadaFavouriteDash($scada_id: uuid, $line_id: uuid, $user_id: uuid) {
  delete_neo_skeleton_scada_dash_star_fav(where: {scada_id: {_eq: $scada_id}, line_id: {_eq: $line_id}, user_id: {_eq: $user_id}}) {
    affected_rows
  }
}
`,
AddCo2:`
mutation AddCo2($co2_value: String, $starts_at: timestamptz, $ends_at: timestamptz, $line_id: uuid, $default_value: Boolean, $created_by: uuid ) {
  insert_neo_skeleton_co2_factor(objects: {co2_value: $co2_value, starts_at: $starts_at, ends_at: $ends_at, line_id: $line_id, default_value: $default_value, created_by: $created_by}, on_conflict: {constraint: co2_factor_pkey, update_columns: [co2_value]}) {
    affected_rows
    returning {
      id
      default_value
    }
  }
} 
`,
UpdateCo2Factor:`
mutation UpdateCo2Factor($id: uuid, $co2_value : String, $starts_at: timestamptz, $ends_at: timestamptz, $updated_by: uuid ) {
  update_neo_skeleton_co2_factor(where: {id: {_eq: $id}}, _set: {co2_value: $co2_value, starts_at: $starts_at, ends_at: $ends_at, updated_by: $updated_by}) {
    affected_rows
  }
}
`,
DeleteCo2:`
mutation DeleteCo2($id: uuid) {
  delete_neo_skeleton_co2_factor(where: {id: {_eq: $id}}) {
    affected_rows
    returning {
      co2_value
    }
  }
}
`,
AddOfflineAlerts:`
mutation addOfflineAlerts($iid: String, $frequency_seconds: Int = 10,  $escalation_users: jsonb, $escalation_times: _int4, $created_by: uuid, $created_at: timestamp, $line_id: uuid, $last_check_time: timestamp, $last_escalation_level: Int, $updated_at: timestamp, $updated_by: uuid,$frequency_count: smallint,) {
  insert_neo_skeleton_alerts_offline(objects: {iid: $iid, frequency_seconds: $frequency_seconds, created_by: $created_by, created_at: $created_at, line_id: $line_id, last_check_time: $last_check_time, last_escalation_level: $last_escalation_level, updated_at: $updated_at, updated_by: $updated_by, escalation_users: $escalation_users, escalation_times: $escalation_times,frequency_count: $frequency_count, }) {
    affected_rows
  }
}

`,
updateOfflineAlerts:`
mutation updateOfflineAlerts(
  $iid: String, 
  $escalation_users: jsonb, 
  $frequency_count: smallint, 
  $escalation_times: _int4, 
  $frequency_seconds: Int, 
  $updated_by: uuid, 
  $last_check_time: timestamp, 
  $last_escalation_level: Int, 
  $line_id: uuid
) {
  update_neo_skeleton_alerts_offline(
    where: {iid: {_eq: $iid}}, 
    _set: {
      escalation_users: $escalation_users, 
      frequency_count: $frequency_count, 
      escalation_times: $escalation_times, 
      frequency_seconds: $frequency_seconds, 
      updated_by: $updated_by, 
      last_check_time: $last_check_time, 
      last_escalation_level: $last_escalation_level, 
      line_id: $line_id
    }
  ) {
    affected_rows
  }
}
`,

deleteOfflineAlerts:`
mutation deleteOfflineAlerts($iid: [String!]) {
  delete_neo_skeleton_alerts_offline(where:  {iid: {_in: $iid}}) {
    affected_rows
  }
}


`,
addPartComments:`
  mutation add_part_comments($asset_id: uuid, $comments: String, $param_comments: jsonb, $part_completed_time: timestamptz, $user_id: uuid, $line_id: uuid) {
    insert_neo_skeleton_prod_part_comments_one(object: {asset_id: $asset_id, comments: $comments, param_comments: $param_comments, created_by: $user_id, updated_by: $user_id, part_completed_time: $part_completed_time, line_id: $line_id}) {
      id
    }
  }
  
`



}


if(import.meta.env.VITE_STAGE === 'stage' || import.meta.env.VITE_STAGE === 'local-stage'){
const updatedJson = {};
for (const [key, value] of Object.entries(mutations)) {
  let newValue = value;
  for (const [target, replacement] of Object.entries(replacements)) {
    newValue = newValue.replaceAll(target, replacement);
  }
  updatedJson[key] = newValue;
}
  mutations = updatedJson;
}



export default mutations;

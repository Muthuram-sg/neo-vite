const Queries = {
  GetUserDefaults: `
  query GetUserDefaults($user_id: uuid, $disable: Boolean = false) {
    neo_skeleton_user(where: {id: {_eq: $user_id}}) {
      id
      avatar
      email
      name
      mobile
      sgid
      created_ts
      updated_ts
      faulthistory_access
      user_notification {
        clear_notification_checkpoint
        notification_checkpoint
        read_checkpoint
      }
      user_role_lines(where: {disable: {_eq: $disable}}, order_by: {line: {name: asc}}) {
        line {
          id
          name
          plant_name
          gaia_plant_id
          schema
          location
          custom_name
          area_name
          energy_asset
          dash_aggregation
          mic_stop_duration
          shift
          timeslot
          node
          updated_ts
          logo
          cycle_time
          type
          gaia_plants_detail {
            activity_name
            business_name
            gaia_plant_name
          }
          appTypeByAppType {
            id
            description
          } 
          lines_hierarchies {
            id
            child_line_ids
          }
          hierarchies {
            id
            line_id
            hierarchy
            name
          }
        }
      }
    }
  }
  `,
  GetSavedForms: `
  query GetUserForms($user_id: uuid, $line_id: uuid) {
    neo_skeleton_forms_user_access(where: {user_id: {_eq: $user_id}, form: {line_id: {_eq: $line_id}}}) {
      form {
        id
        name
        subtitle
        time_resolution
        incoming_web_hook
        frequency
        observation
        image
        custome_form
        image_set
        form_metrics {
          id
          mandatory
          metric_name
          metric_unit
          field_type
          entity
        }
        userByUpdatedBy{
          name
        }
        updated_by
        updated_ts
        created_by
      }
      
      
    }
  }
  `,
  getMetricUnit: `
    query getMetricUnit {
    neo_skeleton_metric_unit {
        id
        description
        unit
    }
    }
    `,
  getMetricDataType: `
    query getMetricDataType {
      neo_skeleton_metric_datatype {
        type
        id
      }
    }
    `,
  GetUserRoleList: `
  query GetUserRoleList{
    neo_skeleton_roles(where: {_not: {id: {_eq: 1}}}) {
      id
      role
    }
  }
  `,
  GetConnectivityChannel: `
  query GetConnectivityChannel($type: uuid = "") {
    neo_skeleton_notification_channels(where: {type: {_eq: $type}}) {
      type
      parameter
    }
  }`,
  GetSavedReports: `
  query getSavedReports($line_id: uuid) {
    neo_skeleton_reports(where: {_or: [{line_id: {_eq: $line_id}}, {_and : [{line_id: {_is_null: true}}, {custome_reports: {_eq: false}}]}]}) {
      id
      name
      description
      custome_reports
      aggreation
      metric_ids
      entity_ids
      instument_ids
      user_access_list
      group_by
      hierarchy_id
      startsat
      last_opened
      userByUpdatedBy {
        name
        id
      }
      created_by
      updated_ts
      public_access
      alert_channels
      alert_users
      send_mail
      config
      instrument_list_from
      group_aggregation
      table_layout
    }
  }
  
  `,
  HierearchyReportSelect: `
  query HierearchyReportSelect($hier_id: uuid) {
    neo_skeleton_reports(where: {hierarchy_id: {_eq: $hier_id}}) {
      id
      hierarchy_id
    }
  }
  `,

  getFormUsers: `
  query getFormUsers($form_id: String) {
    neo_skeleton_forms_user_access(where: {forms_id: {_eq: $form_id}}) {
      userByUserId {
        id
        name
      }
    }
  }  
  `,
  GetUsersListForLine: `
  query GetUsersListForLine($line_id: uuid, $disable: Boolean = false) {
    neo_skeleton_user_role_line(where: {line_id: {_eq: $line_id}, disable: {_eq: $disable}}, order_by: {userByUserId: {name: asc}}) {
      role_id
      user_id
      created_ts
      updated_ts
      role {
        id
        role
      }
      userByUserId {
        id
        name
        email
        mobile
        sgid
      }
    }
  }
  
  `,
  GetStandardDashboardList: `
  query GetAllModulesAndSubModulesWithVisibility($line_id: uuid) {
    neo_skeleton_modules {
      module_id
      module_name
      short_text
      is_default
      module_accesses(where: {line_id: {_eq: $line_id}}) {
        is_visible
        access_id
      }
      sub_modules {
        sub_module_id
        sub_module_name
        sub_module_accesses(where: {line_id: {_eq: $line_id}}) {
          is_visible
          line_id
          access_id
        }
      }
    }
  }
  `,
  GetStandardReportList: `
query GetStandardReportList {
  neo_skeleton_reports(where: {custome_reports: {_eq: false}}) {
    id
    name
  }
}

`,
  GetMultilineUsersList: `
    query GetUsersListForLine($line_id: [uuid!], $disable: Boolean = false) {
      neo_skeleton_user_role_line(where: {line_id: {_in: $line_id}, disable: {_eq: $disable}}, order_by: {userByUserId: {name: asc}}) {
        role_id
        user_id
        created_ts
        updated_ts
        role {
          id
          role
        }
        userByUserId {
          id
          name
          email
          mobile
          sgid
        }
      }
    }  
  `,
  getChannelListForLine: `
  query getChannelListForLine($line_id: uuid) {
    neo_skeleton_notification_channels(where: {line_id: {_eq: $line_id}}, order_by: {name: asc}) {
      id
      line_id
      name
      type
      parameter
      notificationChannelType {
        id
        name
      }
      userByCreatedBy {
        id
        name
      }
    }
  }
  
  `,
  getUsersList: `
  query GetUsersList {
    neo_skeleton_user(order_by: {name: asc}) {
      id
      name
      sgid
      email
      mobile
    }
  }
`,
  getMetricsForInstrument: `
  query getMetricsForInstrument($id: [String!], $distinct_on: [neo_skeleton_instruments_metrics_select_column!] = metrics_id) {
    neo_skeleton_instruments_metrics(where: {instruments_id: {_in: $id}}, distinct_on: $distinct_on) {
      frequency
      metric {
        id
        name
        title
        type
        metricUnitByMetricUnit {
          unit
        }
      }
    }
  }
  `,
  getIntrumentType: `
    query getIntrumentType($line_id: uuid = "") {
    neo_skeleton_instruments(where: {line_id: {_eq: $line_id}}) {
      id
      name
      instrument_type
      instrumentTypeByInstrumentType {
        name
      }
    }
  }
  `,
  getInstrumentCategory: `
  query getInstrumentCategory {
    neo_skeleton_instrument_category(order_by: {name: asc}) {
      id
      name
    }
  }
  `,
  getInstrumentCategorybyLine: `
query getInstrumentCategorybyLine($line_id: uuid = "") {
  neo_skeleton_instruments(where: {line_id: {_eq: $line_id}}, distinct_on: category) {
    instrument_category {
      id
      name
    }
  }
}
  `,
  getFormsList: `
  query getFormsList($line_id: uuid, $user_id: uuid) {
    neo_skeleton_forms(where: {line_id: {_eq: $line_id}, _and: {forms_user_access: {user_id: {_eq: $user_id}}}}) {
      name
      id
    }
  }
  `,
  getMetricsForSingleInstrument: `
  query getMetricsForSingleInstrument($instruments_id: String) {
    neo_skeleton_instruments_metrics(where: {instruments_id: {_eq: $instruments_id}}) {
      id
      frequency
      metric {
        id
        name
        title
        metricUnitByMetricUnit {
          unit
        }
        metric_datatype
        metricDatatypeByMetricDatatype {
          type
        }
      }
      on_change
    }
  }
  `,
  getMetricsForInstrumentWithID: `
  query getMetricsForInstrumentWithID($id: [String!]) {
    neo_skeleton_instruments_metrics(where: {instruments_id: {_in: $id}}) {
      instruments_id
      metrics_id
      metric {
        id
        name
        title
        metricUnitByMetricUnit {
          unit
        }
        metric_datatype
        Enable
      }
      instrument {
        category
        name
      }
      frequency
      enable_forecast
      factor
      calibrate
    }
  }
  `,
  getMetricsInstrument: `
  query getMetricsForInstrumentWithID {
    neo_skeleton_instruments_metrics {
      instruments_id
      frequency
    }
  }
  `,
  getMetricList: `
  query getMetricList($line_id: uuid, $form_id: String) {
    neo_skeleton_form_metrics(where: {form: {line_id: {_eq: $line_id}, id: {_eq: $form_id}}}) {
      metric_name
      id
    }
  }`,
  getLimits: `
  query getLimits ($metric_name: String , $iid : String) {
    neo_skeleton_alerts_v2(where: {instruments_metric: {metric: {name: {_eq: $metric_name}}, _and: {instruments_id: {_eq: $iid}}}}) {
      critical_value
      critical_type
      critical_min_value
      critical_max_value
      instruments_metric {
        metric {
          name
          title
        }
        instruments_id
      }
      warn_value
      warn_type
      warn_min_value
      warn_max_value
    }
  }`,

  getMetrics: `
  query getMetrics($id: uuid) {
    neo_skeleton_alerts_v2(where: {id: {_eq: $id}}) {
      insrument_metrics_id
      id
      instruments_metric {
        metric {
          name
        }
      }
    }
  }`,  

  getDefectsDetails: `
  query getDefectsDetails($defect_id: [bigint!] = "") {
  neo_skeleton_defects(where: {defect_id: {_in: $defect_id}}) {
    defect_id
    defect_name
    fault_action_recommendeds {
      action_recommended
      severity_id
    }
  }
}`,  

  getMinFrequency: `
  query getMinFrequency( $iid : String ,$metric_name: String ) {
    neo_skeleton_instruments_metrics(where: {instruments_id: {_eq: $iid}, _and: {metric: {name: {_eq: $metric_name}}}}) {
      instruments_id
      metric {
        name
        id
      }
      frequency
    }
  }`,

  getUserFormMetricsIDs: `
  query getUserFormMetricsIDs($user_id: uuid, $line_id: uuid) {
    neo_skeleton_forms_user_access(where: {user_id: {_eq: $user_id}, form: {line_id: {_eq: $line_id}}}) {
      form {
        form_metrics {
          id
        }
      }
    }
  }`,
  GetLineHierarchy: `
  query GetLineHierarchy($line_id: uuid) {
    neo_skeleton_hierarchy(where: {line_id: {_eq: $line_id}}, order_by: {created_ts: asc}) {
      id
      name
      line_id
      hierarchy
      updated_ts
      created_by
      userByUpdatedBy {
        name
      }
    }
  }
  `,
  GetMultiLineHierarchy: `
  query GetMultiLineHierarchy($line_id: [uuid!]) {
    neo_skeleton_hierarchy(where: {line_id: {_in: $line_id}}, order_by: {created_ts: asc}) {
      id
      name
      line_id
      hierarchy
      updated_ts
      created_by
      userByUpdatedBy {
        name
      }
    }
  }
  `,
  getgialistDetails: `
  query MyQuery {
    neo_skeleton_gaia_plants_details {
      activity_name
      business_name
      country_name
      gaia_plant_name
      gaia_plant_code
      lines {
            name
            gaia_plant_id
            id
            appTypeByAppType {
              id
              description
            }
      }
    }
  }  
  `,
  getGaiaDetails: `
  query getGaiaDetails {
    neo_skeleton_gaia_plants_details {
      activity_name
      business_name
      country_name
      gaia_plant_name
      gaia_plant_code
    }
  }
  `,
  getLines: `
  query getLines($line_id: uuid) {
    neo_skeleton_lines(where: {id: {_eq: $line_id}}) {
      id
      name
      contact_person_id
    }
  }
  `,
  getAllLineLocation: `
  query getLineLocation{
    neo_skeleton_lines(distinct_on: location){
      location,
      area_name
    }
  }`,
  getAllTemperatureInstrumentData:`
  query getAllTemperatureInstrument($line_id: uuid){
    neo_skeleton_instruments(where: {line_id: {_eq: $line_id}}) {
      id
      name
    }
  }
  `,
  getUsers: `
  query getUsers($id: uuid) {
    neo_skeleton_user(where: {id: {_eq: $id}}) {
      id
      name
      email
      mobile
    }
  }
  `,
  
  getRoles: `
  query getRoles{
    neo_skeleton_roles(where: {_not: {id: {_eq: 1}}}) {
      id
      role
    }
  }
  `,
  getAccessReqHistory: `
  query getAccessReqHistory($user_id: uuid) {
    neo_skeleton_user_request_access(where: {created_by: {_eq: $user_id}}, order_by: {created_ts: desc}) {
      id
      approve
      reject
      reject_reason
      updated_ts
      line {
        name
        gaia_plants_detail {
          activity_name
          business_name
          country_name
        }
      }
      created_ts
      userByUpdatedBy{
        id
              name
      }
    }
  }
  `,
  PendingReqList: `
  query getPendingReq($user_id: uuid, $line_id: uuid) {
    neo_skeleton_user_request_access(where: {created_by: {_neq: $user_id}, approve: {_eq: false}, reject: {_eq: false}, line_id: {_eq: $line_id}}) {
      id
      approve
      reject
      reject_reason
      updated_ts
      user {
        id
        name
      }
      role {
        id
        role
      }
      line {
        id
        name
        gaia_plants_detail {
          activity_name
          business_name
          country_name
        }
      }
    }
  }
  
  `,
  GetAccessLinesList: `
  query GetAccessLinesList($user_id: uuid) {
    neo_skeleton_user_role_line(where: {user_id: {_eq: $user_id}}, order_by: {line: {name: asc}}) {
      user_id
      role_id
      line_id
      created_ts
      updated_ts
      line {
        id
        name
        gaia_plants_detail {
          business_name
        }
        appTypeByAppType {
          description
          id
        }
      }
      role {
        role
      }
      userByCreatedBy {
        name
      }
    }
  }
  `,
  getProducts: `
  query GetProducts {
    neo_skeleton_prod_products {
      id
      product_id
      name
      unit
      info
      updated_ts
      expected_energy
      moisture_in
      moisture_out
      cycle_time_unit
      expected_energy_unit
      is_micro_stop
      mic_stop_from_time
      mic_stop_to_time
      userByUpdatedBy {
        id
        name
      }
      created_ts
      user {
        id
        name
      }
      prod_orders {
        id
        order_id
        end_dt
        prod_execs {
          end_dt
          order_id
          id
          start_dt
          operator_id
        }
      }
    }
  }
  
  `,

 
  getExecution: `
query GetProducts($line_id: uuid)  {
  neo_skeleton_prod_exec(where: {line_id: {_eq: $line_id}}) {
    id
    created_ts
    entity_id
    start_dt
    end_dt
    updated_by
    created_by
    line_id
    decline_reason
    entity {
      name
    }
    prod_order {
      order_id
      qty
      prod_product {
        product_id
        unit
      }
      id
      end_dt
      start_dt
      delivery_date
    }
    userByOperatorId {
      id
      name
    }
    delivery_date
    status
    id
    info
  }
}

  
`,
getExecutionForLine: `
query getExecutionForLine($line_id: uuid, $start_dt: timestamptz,, $end_dt: timestamptz) {
  neo_skeleton_prod_exec(where: {line_id: {_eq: $line_id}, start_dt: {_gte: $start_dt, _lte: $end_dt}}) {
    id
    created_ts
    entity_id
    start_dt
    end_dt
    updated_by
    created_by
    line_id
    decline_reason
    entity {
      name
    }
    prod_order {
      order_id
      qty
      prod_product {
        product_id
        unit
      }
      id
      end_dt
      start_dt
      delivery_date
    }
    userByOperatorId {
      id
      name
    }
    delivery_date
    status
    id
    info
  }
}


  
`,
  getWorkOrdersWithID: `
query getWorkOrdersWithID($id: uuid) {
  neo_skeleton_prod_order(where: {product_id: {_eq: $id}}) {
    id
  }
}

 `,

  getProductWithProdID: `
 query getProductWithProdID($pid: uuid) {
  neo_skeleton_prod_products(where: {id: {_eq: $pid}}) {
    id
  }
}

`,

  getWorkOrders: `
  query GetWorkOrders {
    neo_skeleton_prod_order {
      id
      order_id
      created_ts
      start_dt
      end_dt
      qty
      updated_ts
      created_ts
      delivery_date
      quantity_unit
      prod_product {
        id
        product_id
        name
        unit
        info
      }
      userByUpdatedBy {
        id
        name
      }
      prod_execs {
        status
        id
        start_dt
        end_dt
      }
    }
  }
  `,
  getWorkInitiations: `
  query getWorkInitiations {
    neo_skeleton_prod_exec {
      id
      start_dt
      end_dt
      updated_ts
      entity {
        id
        name
      }
      prod_order {
        id
        order_id
        start_dt
        end_dt
        qty
      }
      userByUpdatedBy {
        id
        name
      }
      userByOperatorId {
        id
        name
      }
    }
  }
  `,
  getReasons: `
  query GetReasons {
    neo_skeleton_prod_reasons {
      id
      reason
      updated_ts
      reason_type_id
      include_in_oee
      prod_reason_type {
        id
        reason_type
      }
      userByUpdatedBy {
        id
        name
      }
      reason_tag
      hmi

       
    }
  }
  `,
  getReasonType: `
query getReasonType {
  neo_skeleton_prod_reason_types(where: {standard: {_neq: true}}) {
    id
    reason_type
  }
}

`,
  getReasonTypes: `
  query GetReasonTypes {
    neo_skeleton_prod_reason_types {
      id
      reason_type
      updated_ts
      standard
      userByUpdatedBy {
        id
        name
      }
    }
  }
  `,
  getReasonsListbyType: `
  query getReasonsListbyType($reasonType: bigint , $tagType : uuid) {
    neo_skeleton_prod_reasons(where: {reason_type_id: {_eq: $reasonType}, _and: {prod_reason_tag: {id: {_eq: $tagType}}}}) {
      id
      reason
      
    }
  }
  `,
  getReasonsListbyTypeOnly: `
  query getReasonsListbyTypeOnly($reasonType: bigint ) {
    neo_skeleton_prod_reasons(where: {reason_type_id: {_eq: $reasonType}}) {
      id
      reason
      
    }
  }
  `,
  getReasonsbyTags: `
  query getReasonsbyTags($reasonTag: [uuid!]) {
    neo_skeleton_prod_reasons(where: {reason_tag: {_in: $reasonTag}}) {
      id
      reason
      reason_type_id
      prod_reason_type {
        reason_type
        id
        updated_ts
        standard
        userByUpdatedBy {
          id
          name
        } 
      }
    }
  }
  `,
  getQualityDefects: `
  query GetQualityDefects {
    neo_skeleton_prod_quality_defects {
      id
      quantity
      updated_ts
      entity {
        id
        name
      }
      prod_order {
        id
        order_id
        start_dt
        end_dt
        qty
      }
      prod_reason {
        id
        reason
        prod_reason_type {
          id
          reason_type
        }
      }
      userByUpdatedBy {
        id
        name
      }
    }
  }
  `,
  getOutages: `
  query GetOutages {
    neo_skeleton_prod_outage {
      id
      start_dt
      end_dt
      updated_ts
      entity {
        id
        name
      }
      prod_order {
        id
        order_id
        start_dt
        end_dt
        qty
      }
      prod_reason {
        id
        reason
        prod_reason_type {
          id
          reason_type
        }
      }
      userByUpdatedBy {
        id
        name
      }
    }
  }
  `,
  getInstrumentFormula: `
 query GetVirtualInstrument($line_id: uuid) {
  neo_skeleton_virtual_instruments(where: {line_id: {_eq: $line_id}}, order_by: {name: asc}) {
    id
    name
    line_id
    formula
    updated_ts
    userByUpdatedBy{
name
    }
  }
}

`,
  getMultiLineInstrumentFormula: `
query GetVirtualInstrument($line_id: [uuid!]) {
  neo_skeleton_virtual_instruments(where: {line_id: {_in: $line_id}}, order_by: {name: asc}) {
    id
    name
    line_id
    formula
  }
}
`,
  getHierarchyAssetList:

    `query getHierarchyAssetList($line_id: uuid) {
  neo_skeleton_entity(where: {entity_type: {_eq: 3}, line_id: {_eq: $line_id}}) {
    entity_instruments {
      instrument {
        id
        name
        instrument_type
        is_offline
        is_scaling_factor
        instrument_category {
          id
          name
        }
        instrumentTypeByInstrumentType {
          id
          name
        }
        userByUpdatedBy {
          id
          name
        }
        instruments_metrics {
          frequency
          factor
          calibrate
          metric {
            id
            name
            title
          }
        }
      }
    }
    id
    name
    entity_type
    entity_instruments
  }
}
`,
  getRealInstrumentList: `
  query getRealIntrumentsList($line_id: uuid) {
    neo_skeleton_instruments(where: {line_id: {_eq: $line_id}}) {
      id
      name
      instrument_type
      is_offline
      enable_forecast
      is_scaling_factor
      instrument_class
      instrument_category {
        id
        name
      }
      alerts_offline{
        frequency_count
        frequency_seconds
        escalation_times
        escalation_users
        line_id
      }
      instrumentTypeByInstrumentType {
        id
        name
      }
      userByUpdatedBy {
        id
        name
      }
      instruments_metrics {
        id
        frequency
        factor
        calibrate
        enable_forecast
        metric {
          id
          name
          title
        }
        instruments_metrics_forecasting {
          status
          timestamp
        }
      }
    }
  }
  
  `,
  getInstrumentType: `
  query getInstrumentType($instrument_category_id: Int) {
    neo_skeleton_instrument_types(where: {instrument_category: {id: {_eq: $instrument_category_id}}}, order_by: {name: asc}) {
      id
      name
    }
  }
  `,
  getInstrumentTypeByLine: `
  query getInstrumentTypeByLine($line_id: uuid = "", $id: Int = 10) {
  neo_skeleton_instruments(where: {line_id: {_eq: $line_id}, instrument_category: {id: {_eq: $id}}}, distinct_on: instrument_type) {
    instrumentTypeByInstrumentType {
      id
      name
    }
  }
}
`,
  GetUserLineHierarchy: `
  query GetUserLineHierarchy($user_id: uuid, $line_id: uuid) {
    neo_skeleton_user_line_default_hierarchy(where: {user_id: {_eq: $user_id}, _and: {line_id: {_eq: $line_id}}}) {
      updated_ts
      hierarchy {
        id
        line_id
        name
        hierarchy
        updated_ts
        userByUpdatedBy {
          name
        }
      }
    }
  }
  `,
  getAssetInfo: `
  query getAssetInfo($entity_id: uuid) {
    neo_skeleton_entity_info(where: {entity_id: {_eq: $entity_id}}) {
      info
      entity_id
    }
  }
  `,
  GetEntityList: `
  query GetEntityList($line_id: uuid) {
  neo_skeleton_entity(where: {line_id: {_eq: $line_id}}, order_by: {name: asc}) {
    id
    name
    entity_type
    asset_types
    info
    analysis_types
    created_ts
    updated_ts
    spindle_speed_threshold
    feed_rate_threshold
    userByUpdatedBy{
      name
    }
    is_zone
    entityTypeByEntityType {
      name
    }
    user {
      name
    }
    prod_asset_oee_configs {
      id
      planned_downtime
      setup_time
      enable_setup_time
      is_part_count_binary
      is_part_count_downfall
      is_status_signal_available
      dressing_signal
      dressing_program
      mic_stop_duration
      min_mic_stop_duration
      is_standard_microstop
      metric {
        id
        name
      }
      instrument {
        id
        name
      }
      instrumentByMachineStatusSignalInstrument {
        id
        name
      }
      metricByMachineStatusSignal {
        id
        name
      }
      metricByDressingSignal {
        id
        name
      }
      above_oee_color
      above_oee_value
      below_oee_color
      below_oee_value
      between_oee_color
    }
    entity_instruments {
      entity_id
      instrument_id
    }
    dryer_config {
      entity_id
      id
      is_enable
      moisture_input
      moisture_input_instrument
      moisture_output
      moisture_output_instrument
      total_sand_dried
      total_sand_dried_instrument
      total_sand_fed
      total_sand_fed_instrument
      total_scrap
      total_scrap_instrument
      total_shutdown_time
      total_shutdown_time_instrument
      total_startup_time
      total_startup_time_instrument
      electrical_energy_consumption
      electrical_energy_consumption_instrument
      empty_run_time
      empty_run_time_instrument
      gas_energy_consumption
      gas_energy_consumption_instrument
    }
    node_zone_mappings {
      id
      entity_id
      asset_id
    }
    sap_equipments {
      equipment_code
    }
    asset_type{
      name
    }
  }
}

  
  `,
  GetMultilineEntityList: `
  query GetMultilineEntityList($line_id: [uuid!]) {
    neo_skeleton_entity(where: {line_id: {_in: $line_id}}, order_by: {name: asc}) {
      id
      name
      entity_type
      asset_types
      analysis_types
      created_ts
      entityTypeByEntityType {
        name
      }
      user {
        name
      }
      prod_asset_oee_configs {
        id
        planned_downtime
        setup_time
        enable_setup_time
        is_part_count_binary
        is_part_count_downfall
        is_status_signal_available
        dressing_signal
        dressing_program
        mic_stop_duration
        min_mic_stop_duration
        metric {
          id
          name
        }
        instrument {
          id
          name
        }
        instrumentByMachineStatusSignalInstrument {
          id
          name
        }
        metricByMachineStatusSignal {
          id
          name
        }
        metricByDressingSignal {
          id
          name
        }
        above_oee_color
        above_oee_value
        below_oee_color
        below_oee_value
        between_oee_color
      }
      entity_instruments {
        entity_id
        instrument_id
      }
    }
  }
  
  `,
  getParameterList: `
  query getParameterList {
    neo_skeleton_metrics(order_by: {title: asc}) {
      id
      name

      title
      type
      instrument_type
      metricUnitByMetricUnit {
        id
        unit
      }
      metricDatatypeByMetricDatatype {
        id
        type
      }
      instrumentTypeByInstrumentType {
        id
        name
        instrument_category {
          id
          name
        }
      }
      metric_type {
        id
        type
      }
    }
  }
  `,
  getHierarchy: `
  query getHierarchy($id: uuid) {
    neo_skeleton_hierarchy(where: {id: {_eq: $id}}) {
      hierarchy
    }
  }
  `,
  getHierearchyReportSelect: `
  query getHierearchyReportSelect($hier_id: uuid) {
    neo_skeleton_reports(where: {hierarchy_id: {_eq: $hier_id}}) {
      id
      hierarchy_id
    }
  }
  `

  ,
  checkIfLineExists: `
  query checkIfLineExists($plant_id: String) {
    neo_skeleton_lines(where: {gaia_plant_id: {_eq: $plant_id}}) {
      id
      name
      gaia_plant_id
      appTypeByAppType {
        description
        id
      }
    }
  }
  `,
  checkIfReqAlreadyRaised: `
  query checkIfReqAlreadyRaised($line_id: uuid, $user_id: uuid) {
    neo_skeleton_user_request_access(where: {line_id: {_eq: $line_id}, user: {id: {_eq: $user_id}}}) {
      approve
      reject
      reject_reason
      created_ts
    }
  }
  `,
  getInstrumentList: `
  query getInstrumentList($line_id: uuid) {
   neo_skeleton_instruments(where: {line_id: {_eq: $line_id}}, order_by: {name: asc}) {
     id
     instrument_type
     name
     category
     instrument_class
     instrumentTypeByInstrumentType {
       name
     }
     instruments_metrics {
      metric {
        name
        id
        metric_datatype
        title
        props
      }
    }
    instrumentClassByInstrumentClass {
      class
      id
      limits
    }
    created_ts
   }
 }
  `,
  GetMultiLineInstrumentList: `
  query getInstrumentList($line_id: [uuid!]) {
   neo_skeleton_instruments(where: {line_id: {_in: $line_id}}, order_by: {name: asc}) {
     id
     instrument_type
     name
     instrumentTypeByInstrumentType {
       name
     }
   }
 }
  `,
  getInstrumentMapList: `
  query getInstrumentList($line_id: uuid) {
    neo_skeleton_instruments(where: {line_id: {_eq: $line_id}, instruments_metrics: {metric: {name: {_in: ["loc_cord","loc_status","loc_data"]}}}}, order_by: {name: asc}) {
      id
      instrument_type
      name
      instrumentTypeByInstrumentType {
        name
      }
    }
  }
  `,

  getInstrumentmetrics: `
  query MyQuery {
    neo_skeleton_instruments_metrics {
      frequency
      metrics_id
      metric {
        id
        name
        title
        type
        metricUnitByMetricUnit {
          unit
        }
      }
      instruments_id
    }
  }
  `,
  getEntityWithoutAssert: `
  query getEntityWithoutAssert($line_id : uuid) {
    neo_skeleton_entity(where: {line_id: {_eq: $line_id}, entity_type: {_neq: 3}}) {
      id
      name
      entity_type
      entityTypeByEntityType {
        name
      }
     
    }
  }
  `,
  getAssertList: `
  query getAssertList($line_id : uuid) {
    neo_skeleton_entity(where: {line_id: {_eq: $line_id}, entity_type: {_eq: 3}}) {
      id
      name
      info
      entity_type
      entityTypeByEntityType {
        name
      }
      entity_instruments {
        entity_id
        instrument_id
        instrument {
          id
          name
          instrument_type
        }
      }
    }
  }
  `,
  getAssertEnergy: `
  query getAssertEnergy($line_id: uuid,$instrument_type:bigint) {
    neo_skeleton_entity(where: {line_id: {_eq: $line_id}, entity_type: {_eq: 3}, entity_instruments: {instrument: {instrumentTypeByInstrumentType: {resource: {id: {_eq:$instrument_type}}}}}}) {
      id  
      name
      entity_type
      entityTypeByEntityType {
        name
      }
      entity_instruments {
        entity_id
        instrument_id
        instrument {
          id
          name
          instrument_type 
          instrumentTypeByInstrumentType {
            resource {
              id
            }
          }
          instruments_metrics {
            metric {
              id
              name
              metric_type {
                type
                id
              }
            }
          }
        }
      }
    }
  } 
  `,
  GetAdminDashboard: `
  query GetAdminDashboard($line_id: uuid, $user_id: uuid) {
    neo_skeleton_dashboard {
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
    neo_skeleton_user_default_dashboard(where: {user_id: {_eq: $user_id}, _and: {line_id: {_eq: $line_id}}}) {
      line_id
      dashboard {
        id
        name
        dashboard
        layout
      }
    }
  }`,
  getUserDashboard: `query getUserDashboard($line_id: uuid,  $user_id: uuid) {
    neo_skeleton_dashboard(where: {_and: [ {_or: [ {line_id: {_eq: $line_id}}, {line_id: {}} ]} , {_or: [ {standard: {_eq: true}}, {created_by: {_eq: $user_id}} ]} ]} )
    {
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
    neo_skeleton_user_default_dashboard(where: {user_id: {_eq: $user_id}, _and: {line_id: {_eq: $line_id}}}) {
      line_id
      dashboard {
        id
        name
        dashboard
        layout
      }
    }
  }`,
  getTasksTypes: `
  query getTaskTypes {
    neo_skeleton_task_types(order_by: {task_type: asc}) {
      id
      task_type
    }
  }
  `,
  getTaskPriorities: `
  query getTaskPriorities {
    neo_skeleton_task_priority(order_by: {task_level: asc}) {
      id
      task_level
    }
  }
  `,
  getTaskStatus: `
  query getTaskStatus {
    neo_skeleton_task_status(order_by: {status: asc}) {
      id
      status
    }
  }
  `,
  getTaskDataWithEntity: `
  query getTaskDataWithEntity($entity_id: uuid = "") {
    neo_skeleton_tasks(where: {entity_id: {_eq: $entity_id}}, order_by: {reported_date: desc}) {
      reported_date
      id
      title
      taskStatus {
        status
      }
      faultModeByFaultMode {
        name
      }
      action_recommended
      task_id
      taskPriority {
        task_level
      }
      taskType {
        task_type
      }
      observed_date
      userByCreatedBy {
        name
      }
    }
  }
  `,
  getMainLog: `
  query getMainLog($entity_id: uuid = "") {
    neo_skeleton_maintenance_log(where: {entity_id: {_eq: $entity_id}}) {
      log_date
      log
      updated_ts
      userByUpdatedBy {
        name
      }
      id
    }
  }
  `,
  getTaskHistory: `
  query getTaskHistory {
    neo_skeleton_audit(where: {table_name: {_eq: "tasks"}}, order_by: {action_timestamp: asc}) {
      new_values
      old_values
      action
      action_timestamp
      updated_cols
    }
  }
  `,
  checkUserAccessForLine: `
  query checkUserAccessForLine($line_id: uuid, $user_id: uuid) {
    neo_skeleton_user_role_line(where: {line_id: {_eq: $line_id}, user_id: {_eq: $user_id}}) {
      role_id
      user_id
      userByUserId {
        name
      }
    }
  }  
  `,
  channelType: `
  query channelType {
    neo_skeleton_notification_channel_type {
      id
      name
    }
  }  
  `,
  alltasklist: `
  query taskList($line_id: uuid, $from: timestamptz, $to: timestamptz, $instrument_type: Int = 10) {
  neo_skeleton_tasks(where: {entityId: {line_id: {_eq: $line_id}}, reported_date: {_gte: $from, _lte: $to}, instrument: {instrument_type: {_eq: $instrument_type}}}) {
    id
    entity_id
    last_remainded_time
    priority
    status
    title
    type
    assingee
    created_by
    due_date
    description
    created_ts
    updated_by
    updated_ts
    action_taken
    action_recommended
    action_taken_date
    comments
    task_id
    observed_date
    task_closed_by
    taskStatus {
      id
      status
    }
    taskType {
      id
      task_type
    }
    taskPriority {
      id
      task_level
    }
    entityId {
      id
      name
      line_id
    }
    userByAssignedFor {
      email
      id
      name
    }
    userByObservedBy {
      id
      name
    }
    userByReportedBy {
      id
      name
    }
    analysis_type {
      id
      name
    }
    userByCreatedBy {
      name
    }
    tasksAttachements {
      image_path
    }
    task_feedback_action {
      feedback_action
    }
    instrument {
      id
      name
      instrumentTypeByInstrumentType {
        id
        name
      }
      instrument_category {
        id
        name
      }
    }
    faultModeByFaultMode {
      id
      name
    }
    instrument_status_type {
      id
      status_type
    }
    mcc_id
    scc_id
    reported_date
    task_main_component_master {
      id
      code
      description
    }
    task_sub_component_master {
      id
      description
      code
    }
  }
}
`,
  taskList: `
  query taskList($line_id: uuid, $from: timestamptz, $to: timestamptz) {
  neo_skeleton_tasks(where: {entityId: {line_id: {_eq: $line_id}}, reported_date: {_gte: $from, _lte: $to}}) {
    id
    entity_id
    last_remainded_time
    priority
    status
    title
    type
    assingee
    created_by
    due_date
    description
    created_ts
    updated_by
    updated_ts
    action_taken
    action_recommended
    action_taken_date
    comments
    task_id
    observed_date
    task_closed_by
    taskStatus {
      id
      status
    }
    taskType {
      id
      task_type
    }
    taskPriority {
      id
      task_level
    }
    entityId {
      id
      name
      line_id
      asset_type {
        id
        name
      }
      node_zone_mappings {
        asset_id
        entity_id
      }
    }
    userByAssignedFor {
      email
      id
      name
    }
    userByObservedBy {
      id
      name
    }
    userByReportedBy {
      id
      name
    }
    analysis_type {
      id
      name
    }
    userByCreatedBy {
      name
    }
    tasksAttachements {
      image_path
    }
    task_feedback_action {
      feedback_action
    }
    instrument {
      id
      name
      instrumentTypeByInstrumentType {
        id
        name
      }
      instrument_category {
        id
        name
      }
    }
    faultModeByFaultMode {
      id
      name
    }
    instrument_status_type {
      id
      status_type
    }
    mcc_id
    scc_id
    reported_date
    task_main_component_master {
      id
      code
      description
    }
    task_sub_component_master {
      id
      description
      code
    }
  }
}
`,
taskListFull: `
query taskListFull($line_id: uuid) {
  neo_skeleton_tasks(where: {entityId: {line_id: {_eq: $line_id}}}) {
    id
    entity_id
    last_remainded_time
    priority
    status
    title
    type
    assingee
    created_by
    due_date
    description
    created_ts
    updated_by
    updated_ts
    action_taken
    action_recommended
    action_taken_date
    comments
    task_id
    observed_date
    task_closed_by

    taskStatus {
      id
      status
    }
    taskType {
      id
      task_type
    }
    taskPriority {
      id
      task_level
    }
    entityId {
      id
      name
      line_id
    }
    userByAssignedFor {
      email
      id
      name
    }
    userByObservedBy {
      id
      name
    }
    userByReportedBy {
      id
      name
    }
    analysis_type {
      id
      name
    }
    userByCreatedBy {
      name
    }
    tasksAttachements {
      image_path
    }
    task_feedback_action {
      feedback_action
    }
    instrument {
      id
      name
      instrumentTypeByInstrumentType {
        id
        name
      }
      instrument_category {
        id
        name
      }
    }
    faultModeByFaultMode { 
      id 
      name 
    } 
    instrument_status_type { 
      id 
      status_type 
    } 
    mcc_id
    scc_id
    reported_date
    task_main_component_master {
      id
      code
      description
    }
    task_sub_component_master {
      id
      description
      code
    }
  }
}
`,
  // taskCountForline: `
  // query MyQuery($line_id: uuid, $start: timestamptz, $end: timestamptz) {
  //   neo_skeleton_tasks_aggregate(where: {entityId: {line_id: {_eq: $line_id}}, created_ts: {_gt: $start, _lt: $end}}) {
  //     aggregate {
  //       count
  //     }
  //   }
  // }
  // `,
  taskCountForline: `
query taskCountForline($line_id: uuid, $start: timestamptz, $end: timestamptz,$today_start: timestamptz,$today_end: timestamptz) {
  actual_range:neo_skeleton_tasks_aggregate(where: {entityId: {line_id: {_eq: $line_id}}, created_ts: {_gt: $start, _lt: $end}}) {
    aggregate {
      count
    }
  }
  today:neo_skeleton_tasks_aggregate(where: {entityId: {line_id: {_eq: $line_id}}, created_ts: {_gt: $today_start, _lt: $today_end}}) {
    aggregate {
      count
    }
  }  
}
`,
  executionCountForLine: `
query executionCountForLine($line_id: uuid, $start: timestamptz = "", $end: timestamptz = "",$today_start: timestamptz,$today_end: timestamptz) {
  actual_range:neo_skeleton_prod_exec_aggregate(where: {line_id: {_eq: $line_id}, created_ts: {_gt: $start, _lt: $end}}) {
    aggregate {
      count
    }
  }
  today:neo_skeleton_prod_exec_aggregate(where: {line_id: {_eq: $line_id}, created_ts: {_gt: $today_start, _lt: $today_end}}) {
    aggregate {
      count
    }
  }
}
`,
  GetTaskActionTaken: `
  query GetTaskActionTaken($mcc_id: uuid, $scc_id: uuid ) {
    neo_skeleton_task_feedback_action(where: {mcc_id: {_eq: $mcc_id}, scc_id: {_eq: $scc_id}}) {
      feedback_action
      id
      legacy_id
      fm_id
    }
  }`,
  LinetaskList: `
query LinetaskList($id: uuid) {
  neo_skeleton_tasks(where: {entity_id: {_eq: $id}}) {
   id
      entity_id
      priority
      status
      title
      type
      assingee
      created_by
      due_date
      description
      created_ts
      updated_by
      updated_ts
      action_taken
      action_recommended
      comments
      task_id
      taskStatus {
        id
        status
      }
      taskType {
        id
        task_type
      }
      taskPriority {
        id
        task_level
      }
      entityId {
        id
        name
      }
      userByAssignedFor {
        id
        name
      }
      userByCreatedBy {
        name
      }
      tasksAttachements {
        image_path
      }
  }
}
`,
  duplicateInstrument: `
query dupllicateInstrument($id: String) {
  neo_skeleton_instruments_metrics(where: {instruments_id: {_eq: $id}}) {
    instruments_id,
    metrics_id
  }
}
`,
FetchInstumentlistbyLine:`
query FetchInstumentlistbyLine($line_id: uuid) {
  neo_skeleton_instruments(where: {line_id: {_eq: $line_id}}) {
    id
    name
    is_offline
  }
}`,
  getInstrumentMetricId: `
query getInstrumentMetricId($metrics_id: [bigint!], $instruments_id: String ) {
  neo_skeleton_instruments_metrics(where: {metrics_id: {_in: $metrics_id}, instruments_id: {_eq: $instruments_id}}) {
    id
    frequency
    instruments_id
    metrics_id
  }
}`,
  getInstrumentMetricIdByInsId: `
query getInstrumentMetricIdByInsId( $instruments_id: String, $metrics_id: bigint ) {
  neo_skeleton_instruments_metrics(where: { instruments_id: {_eq: $instruments_id}, metrics_id: {_eq: $metrics_id}}) {
    id
    frequency
  }
}`, 
  GetMultiLineOEEAssets: `
query getMultiLineOEEAssets($line_id: uuid) {
  neo_skeleton_prod_asset_oee_config(where: {entity: {line_id: {_eq: $line_id}}}) {
    id
    entity {
      id
      name
      line_id
      line {
        schema
      }
      dryer_config {
        is_enable
      }
    }
    part_signal_instrument
    metric {
      name
    }
    is_part_count_binary
    is_part_count_downfall
    is_status_signal_available
    machine_status_signal_instrument
    machine_status_signal
    metricByMachineStatusSignal {
      name
    }
    metricByDressingSignal {
      name
    }
    mic_stop_duration
    entity_id
    dressing_program
    dressing_signal
  }
}
`,
  getAssetOEEConfigs: `
  query getAssetOEEConfigs($line_id: uuid, $start_dt: timestamptz = "now()", $end_dt: timestamptz = "now()") {
    neo_skeleton_prod_asset_oee_config(where: {entity: {line_id: {_eq: $line_id}}}) {
      id
      entity_id
      part_signal_instrument
      part_signal
      machine_status_signal_instrument
      machine_status_signal
      planned_downtime
      setup_time
      enable_setup_time
      is_part_count_binary
      is_part_count_downfall
      is_status_signal_available
      mic_stop_duration
      dressing_signal
      dressing_program
      entity {
        id
        name
        line_id
        dryer_config {
          is_enable
        }
        prod_asset_analytics_config {
          entity_id
          id
          config
        }
        entityTypeByEntityType {
          id
          name
        }
        prod_execs(where: {start_dt: {_lte: $start_dt}, _or: {end_dt: {_gte: $end_dt}}}) {
          id
          start_dt
          end_dt
          userByOperatorId {
            id
            name
          }
          prod_order {
            id
            qty
            start_dt
            end_dt
            order_id
            prod_product {
              id
              product_id
              name
              unit
            }
          }
        }
        prod_outages {
          id
          order_id
          start_dt
          end_dt
          prod_reason {
            id
            reason
            prod_reason_type {
              id
              reason_type
            }
          }
        }
        prod_quality_defects {
          id
          quantity
          updated_ts
          marked_at
          prod_order {
            id
            order_id
          }
        }
      }
      instrument {
        id
        name
      }
      metric {
        id
        name
        instrument_type
      }
      instrumentByMachineStatusSignalInstrument {
        id
        name
      }
      metricByMachineStatusSignal {
        id
        name
      }
      metricByDressingSignal {
        id
        name
      }
    }
  }  
`,
  getOnlyAssetOEEConfig: `
  query getOnlyAssetOEEConfig($line_id: uuid) {
    neo_skeleton_prod_asset_oee_config(where: {entity: {line_id: {_eq: $line_id}}}) {
      id
      entity_id
      part_signal_instrument
      part_signal
      machine_status_signal_instrument
      machine_status_signal
      planned_downtime
      setup_time
      enable_setup_time
      is_part_count_binary
      is_part_count_downfall
      is_status_signal_available
      mic_stop_duration
      dressing_signal
      dressing_program
      entity {
        id
        name
        line_id
        entityTypeByEntityType {
          id
          name
        }
      }
      instrument {
        id
        name
      }
      metric {
        id
        name
      }
      instrumentByMachineStatusSignalInstrument {
        id
        name
      }
      metricByMachineStatusSignal {
        id
        name
      }
      metricByDressingSignal {
        id
        name
      }
      above_oee_color
      above_oee_value
      below_oee_color
      below_oee_value
      between_oee_color
    }
  }
  
`,
  getSingleAssetOEEConfig: `query getSingleAssetOEEConfig($asset_id: uuid) {
    neo_skeleton_prod_asset_oee_config(where: {entity_id: {_eq: $asset_id}}) {
      id
      entity_id
      part_signal_instrument
      part_signal
      machine_status_signal_instrument
      machine_status_signal
      planned_downtime
      setup_time
      enable_setup_time
      is_part_count_binary
      is_part_count_downfall
      is_status_signal_available
      is_running_downtime
      mic_stop_duration
      dressing_signal
      dressing_program
      entity {
        id
        name
        line_id
        asset_types
        
        entityTypeByEntityType {
          id
          name
        }
        dryer_config {
          gas_energy_consumption_instrument
          gas_energy_consumption
          electrical_energy_consumption_instrument
          electrical_energy_consumption
          moisture_input_instrument
          moisture_input
          moisture_output_instrument
          moisture_output
          total_sand_dried_instrument
          total_sand_dried
          total_sand_fed_instrument
          total_sand_fed
          total_scrap_instrument
          total_scrap
          total_shutdown_time_instrument
          total_shutdown_time
          total_startup_time_instrument
          total_startup_time
          line_id
          empty_run_time
          empty_run_time_instrument
          is_enable
          id 
          MetricByGasEnergy {
            name
          }
          MetricByElectricalEnergy {
            name
          }
          MetricByExecution {
            name
          }
          MetricByMoistureIn {
            name
          }
          MetricByMoistureOut {
            name
          }
          MetricBySandDried {
            name
          }
          MetricBySandFeed {
            name
          }
          MetricBySandScrap {
            name
          }
        }
        steel_asset_configs {
          id
          form_layout
          calculations
          steel_product_id
        }
      }
      instrument {
        id
        name
      }
      metric {
        id
        name
      }
      instrumentByMachineStatusSignalInstrument {
        id
        name
      }
      metricByMachineStatusSignal {
        id
        name
      }
      metricByDressingSignal {
        id
        name
      }
    }
  }
`,
  getMultipleAssetOEEConfig: `query getMultipleAssetOEEConfig($asset_id: [uuid!]) {
  neo_skeleton_prod_asset_oee_config(where: {entity_id: {_in: $asset_id}}) {
    id
    entity_id
    part_signal_instrument
    part_signal
    machine_status_signal_instrument
    machine_status_signal
    planned_downtime
    setup_time
    enable_setup_time
    is_part_count_binary
    is_part_count_downfall
    is_status_signal_available
    mic_stop_duration
    dressing_signal
    dressing_program
    entity {
      id
      name
      line_id
      entityTypeByEntityType {
        id
        name
      } 
      dryer_config {
        gas_energy_consumption_instrument
        gas_energy_consumption
        electrical_energy_consumption_instrument
        electrical_energy_consumption
        moisture_input_instrument
        moisture_input
        moisture_output_instrument
        moisture_output
        total_sand_dried_instrument
        total_sand_dried
        total_sand_fed_instrument
        total_sand_fed
        total_scrap_instrument
        total_scrap
        total_shutdown_time_instrument
        total_shutdown_time
        total_startup_time_instrument
        total_startup_time
        line_id
        empty_run_time
        empty_run_time_instrument
        is_enable
        id 
        MetricByGasEnergy {
          name
        }
        MetricByElectricalEnergy {
          name
        }
        MetricByExecution {
          name
        }
        MetricByMoistureIn {
          name
        }
        MetricByMoistureOut {
          name
        }
        MetricBySandDried {
          name
        }
        MetricBySandFeed {
          name
        }
        MetricBySandScrap {
          name
        }
      }
    }
    instrument {
      id
      name
    }
    metric {
      id
      name
    }
    instrumentByMachineStatusSignalInstrument {
      id
      name
    }
    metricByMachineStatusSignal {
      id
      name
    }
    metricByDressingSignal {
      id
      name
    }
    min_mic_stop_duration
  }
}
`,
  getExecCycleTime: `query getExecCycleTime($asset_id: uuid, $from: timestamptz, $to: timestamptz) {

    neo_skeleton_prod_exec(where: {start_dt: {_lte: $to}, _or: {end_dt: {_gte: $from}, _and: {entity_id: {_eq: $asset_id}}}}) {

      id

      start_dt

      end_dt

      prod_order {

        prod_product {

          unit

          product_id

          name

        }

        id

        qty

        order_id

      }

      operator_id

      userByOperatorId {

        name

        id

      }

    }
  }`,
  getDowntimeWithReasons: `query getDowntimeWithReasons($asset_id: uuid, $from: timestamptz, $to: timestamptz) {
    neo_skeleton_prod_outage(where: {start_dt: {_lte: $to}, _or: {end_dt: {_gte: $from}, _and: {entity_id: {_eq: $asset_id}}}}) {
      id
      start_dt
      end_dt
      updated_ts
      reason_tags
      reason_id
      entity {
        id
        name
      }
      prod_order {
        id
        order_id
        start_dt
        end_dt
        qty
      }
      prod_reason {
        id
        reason
        include_in_oee
        prod_reason_type {
          id
          reason_type
        }
      }
      userByUpdatedBy {
        id
        name
      }
      comments
    }
  }
`,
getLiveDowntimeWithReasons:`query getLiveDowntimeWithReasons($asset_id: uuid, $from: timestamptz) {
  neo_skeleton_prod_outage(where: {start_dt: {_gte: $from},_or: {end_dt: {_is_null: true}, _and: {entity_id: {_eq: $asset_id}}}}) {
    id
    start_dt
    end_dt
    updated_ts
    reason_tags
    entity {
      id
      name
    }
    prod_order {
      id
      order_id
      start_dt
      end_dt
      qty
    }
    prod_reason {
      id
      reason
      include_in_oee
      prod_reason_type {
        id
        reason_type
      }
    }
    userByUpdatedBy {
      id
      name
    }
    comments
  }
}
`
,
  getAssetQualityDefects: `query getAssetQualityDefects($asset_id: uuid, $from: timestamptz, $to: timestamptz) {
  neo_skeleton_prod_quality_defects(where: {marked_at: {_lte: $to}, _and: {marked_at: {_gte: $from}, _and: {entity_id: {_eq: $asset_id}}}}) {
    id
    quantity
    updated_ts
    comments
    prod_order {
      id
      order_id
    }
    prod_reason {
      id
      reason
      prod_reason_type {
        id
        reason_type
      }
    }
  }
}`,
  getAssetOEEConfigsofEntity: `
  query getAssetOEEConfigsofEntity($asset_id: [uuid!], $from: timestamptz, $to: timestamptz) {
    neo_skeleton_prod_asset_oee_config(where: {entity_id: {_in: $asset_id}}) {
      id
      entity_id
      part_signal_instrument
      part_signal
      machine_status_signal_instrument
      machine_status_signal
      planned_downtime
      setup_time
      enable_setup_time
      is_part_count_binary
      is_part_count_downfall
      is_status_signal_available
      mic_stop_duration
      min_mic_stop_duration
      dressing_signal
      dressing_program
      entity {
        id
        name
        line_id
        entityTypeByEntityType {
          id
          name
        }
        prod_execs(where: {start_dt: {_lte: $to}, _or: {end_dt: {_gte: $from}}}) {
          id
          start_dt
          end_dt
          userByOperatorId {
            id
            name
          }
          prod_order {
            id
            qty
            start_dt
            end_dt
            order_id
            prod_product {
              id
              product_id
              name
              unit
            }
            prod_outages {
              comments
            }
          }
        }
        prod_outages {
          id
          order_id
          start_dt
          end_dt
          comments
          prod_reason {
            id
            reason
            prod_reason_type {
              id
              reason_type
            }
          }
        }
        prod_quality_defects {
          id
          quantity
          updated_ts
          comments
          prod_order {
            id
            order_id
          }
          prod_reason {
            id
            reason
            prod_reason_type {
              id
              reason_type
            }
          }
        }
      }
      instrument {
        id
        name
      }
      metric {
        id
        name
      }
      instrumentByMachineStatusSignalInstrument {
        id
        name
      }
      metricByMachineStatusSignal {
        id
        name
      }
      metricByDressingSignal {
        id
        name
      }
    }
  }
  
`,
  checkOEEConfigExistsforAsset: `
query checkOEEConfigExistsforAsset($asset_id: uuid) {
  neo_skeleton_prod_asset_oee_config_aggregate(where: {entity_id: {_eq: $asset_id}}) {
    aggregate {
      count
    }
  }
}
`,
  checkInstrumentId: `
query checkInstrumentId($iid: String) {
  neo_skeleton_instruments_aggregate(where: {id: {_eq: $iid}}) {
    aggregate {
      count
    }
  }
}
`,
  checkReasonCount: `
query checkReasonCount($id: bigint = "") {
  neo_skeleton_prod_outage_aggregate(where: {reason_id: {_eq: $id}}) {
    aggregate {
      count
    }
  }
}
`,
  checkProdQualityDefects: `
query checkProdQualityDefects($id: bigint) {
  neo_skeleton_prod_quality_defects(where: {reason_id: {_eq: $id}}) {
   
    entity_id
  }
}


`,
  checkInstrumentName: `
query checkInstrumentName($name: String, $line_id: uuid) {
  neo_skeleton_instruments_aggregate(
    where: {
      name: { _ilike: $name },
      line_id: { _eq: $line_id }
    }
  ) {
    aggregate {
      count
    }
  }
}
`,
checkEditInstrumentName: `
query checkEditInstrumentName($name: String, $line_id: uuid, $id: String) {
  neo_skeleton_instruments_aggregate(
    where: {
      name: { _ilike: $name },
      line_id: { _eq: $line_id },
      id: { _neq: $id }
    }
  ) {
    aggregate {
      count
    }
  }
}
`,
  getUserRating: `
query getUserRating($user_id: uuid) {
  neo_skeleton_users_rating(where: {user_id: {_eq: $user_id}}, order_by: {created_ts: desc}, limit: 1) {
    user_id
    rating
    description
    created_ts
  }
}
`,
  getNotifications: `
query getNotifications {
  neo_skeleton_notification_release(order_by: {created_ts: desc}, limit: 5) {
    id
    release_name
    release_discription
    created_ts
    user{
    name
    }
  }
}
`,
  getNotificationsGtClear: `
query getNotificationsGtClear($cnc: timestamptz) {
  neo_skeleton_notification_release(order_by: {created_ts: desc}, where: {created_ts: {_gt: $cnc}}) {
    id
    release_name
    release_discription
    created_ts
  }
}
`,
  getNotificationsDatewise: `
query getNotificationsGtClear($from: timestamptz, $to: timestamptz) {
  neo_skeleton_notification_release(order_by: {created_ts: desc}, where: {created_ts: {_gte: $from, _lte: $to}}) {
    id
    release_name
    release_discription
    created_ts
  }
}
`,
  loginHistory: `
query loginHistory($user_id: uuid) {
  neo_skeleton_user_access_history(where: {user_id: {_eq: $user_id}}, order_by: {access_ts: desc}) {
    id
    info
    access_ts
  }
}`,
  getReadNotificationList: `
query getReadNotificationList($_eq: uuid) {
  neo_skeleton_user_notification(where: {user_id: {_eq: $_eq}}) {
    read_checkpoint
  }
}`,
  getClearNotificationCheckpoint: `
query getClearNotificationCheckpoint($_eq: uuid) {
  neo_skeleton_user_notification(where: {user_id: {_eq: $_eq}}) {
    clear_notification_checkpoint
  }
}`,
  resources_unit_price: `
  query resources_unit_price($line_id: uuid) {
    neo_skeleton_resources_unit_price(where: {line_id: {_eq: $line_id}}) {
      id
      resource_unit_price
      resource {
        resource
      }
      currency {
        currency
      }
    }
  }
`,
  alertAggregateFunction: `
query alertAggregateFunction {
  neo_skeleton_alert_check_aggregate_functions {
    aggregate_function
  }
}
`,
  alertList: `
  query alertList($line_id: uuid, $name: order_by = asc) {
  neo_skeleton_connectivity(where: {line_id: {_eq: $line_id}}) {
    id
    name
    instrument_id
    instrument {
      name
    }
    check_type
    check_last_n
    alert_users
    alert_channels
    delivery
    userByUpdatedBy {
      name
    }
  }
  neo_skeleton_alerts_v2(where: {line_id: {_eq: $line_id}}, order_by: {name: $name}) {
    check_aggregate_window_function
    check_aggregate_window_time_range
    check_id
    check_start_time
    check_time
    check_time_offset
    critical_max_value
    critical_min_value
    critical_type
    critical_value
    time_slot_id
    delivery
    id
    instruments_metric {
      metric {
        id
        name
        title
      }
      instrument {
        id
        name
      }
    }
    insrument_metrics_id
    name
    warn_max_value
    warn_min_value
    warn_type
    warn_value
    status
    alert_channels
    alert_users
    userByUpdatedBy {
      name
    }
    check_last_n
    check_type
  }
}

  `,
  GetShiftDate: `query GetShiftdate($line_id: uuid) {
    neo_skeleton_lines(where: {id: {_eq: $line_id}}) {
      shift
    }
  }`,
  GetTimeSlotData:
    `query GetTimeSlotdate($line_id: uuid) {
    neo_skeleton_lines(where: {id: {_eq: $line_id}}) {
      timeslot
    }
  }`,
  getmetricunit: `
  query getmetricname {
   neo_skeleton_metrics {
     name
     title
     metricUnitByMetricUnit {
       id
       unit
     }
   }
 }
   `,
  GetUpdatedLineData:
    `query GetUpdatedLineData($line_id : uuid) {
    neo_skeleton_lines(where: {id: {_eq: $line_id}}) {
      id
      name
      gaia_plant_id
      schema
      location
      area_name
      energy_asset
      dash_aggregation
      mic_stop_duration
      shift
      timeslot
      node
      updated_ts
      logo
      type
      gaia_plants_detail {
        activity_name
        business_name
        gaia_plant_name
      }
      appTypeByAppType {
        id
        description
      }
      plant_name
    }
  }
  
  `,
  GetExecution: `
  query GetExecution($line_id: uuid, $exec_end: timestamptz = "", $exec_start: timestamptz = "") {
    neo_skeleton_prod_exec(where: {line_id: {_eq: $line_id}}) {
      id
      order_id
      operator_id
      created_ts
      entity_id
      start_dt
      end_dt
      updated_by
      created_by
      line_id
      userByOperatorId {
        id
        name
      }
      prod_order {
        id
        order_id
        start_dt
        end_dt
        qty
        product_id
        prod_product {
          id
          name
          product_id
          unit
        }
      }
    }
  }
  `,
  GetDowntimeAndQualitydefects: `query GetDowntimeAndQualitydefects($entity_id: uuid, $end_dt: timestamptz, $start_dt: timestamptz) {
    neo_skeleton_prod_outage(where: {start_dt: {_gt: $start_dt}, _and: {start_dt: {_lt: $end_dt}, _and: {end_dt: {_gt: $start_dt}, _and: {end_dt: {_lt: $end_dt}, _and: {entity_id: {_eq: $entity_id}}}}}}) {
      created_ts
      id
      order_id
      entity_id
      reason_id
      start_dt
      end_dt
      prod_reason {
        id
        reason
        prod_reason_type {
          id
          reason_type
        }
      }
    }
    neo_skeleton_prod_quality_defects(where: {created_ts: {_gt: $start_dt}, _and: {created_ts: {_lt: $end_dt}, _and: {entity_id: {_eq: $entity_id}}}}) {
      id
      order_id
      entity_id
      reason_id
      quantity
      created_ts
      prod_reason {
        id
        reason
        prod_reason_type {
          id
          reason_type
        }
      }
    }
  }
  `,
  getRole: `query getRole($line_id: uuid, $user_id: uuid) {
  neo_skeleton_user_role_line(where: {user_id: {_eq: $user_id}, _and: {line_id: {_eq: $line_id}}}) {
    role {
      role
      id
    }
  }
}
`,
  getQualityReports: `query getQualityReports($entity_id: [uuid!], $from: timestamptz, $to: timestamptz) {
 neo_skeleton_prod_quality_defects(where: {_and: [{marked_at: {_gte: $from}}, {marked_at: {_lte: $to}}], entity_id: {_in: $entity_id}, isdelete: {_eq: false}}) {
  id
  created_ts
  created_by
  marked_at
  part_number
  prod_order {
    id
    order_id
  prod_product {
    id
    name
  }
  }
  entity {
  id
  name
  }
  prod_reason {
  id
  reason
  include_in_oee
  }
  user {
   id
   name
  }
  quantity
   }
   neo_skeleton_prod_part_comments(where: {asset_id: {_in: $entity_id}, _and: {part_completed_time: {_gte: $from, _lte: $to}}}) {
  param_comments
  comments
  id
  part_completed_time
  entity {
    id
    name
  }
  prod_order {
    id
    order_id
  }
  user {
    id
    name
  }
  userByUpdatedBy {
    id
    name
  }
    }
    neo_skeleton_steel_data(where: {time: {_gte: $from, _lte: $to}}) {
      entity_id
      key
      time
      value
    }
  }  
  `,
  DowntimeReportList: `query DowntimeReportList($asset_ids: [uuid!], $from: timestamptz,$to: timestamptz) {
    neo_skeleton_prod_outage(where: {entity_id: {_in: $asset_ids}, end_dt: {_lte: $to}, start_dt: {_gte: $from}}) {
      id
      start_dt
      end_dt
      comments
      entity {
        id
        name
      }
      prod_reason {
        id
        reason
      }
    }
  }
  `,
  GetTasks: `query GetTasks($entity_id: [uuid!], $start_dt: timestamptz) {
    neo_skeleton_tasks (where:{entity_id:{_in:$entity_id}, _and: {created_ts: {_gt: $start_dt}}}){
      created_by
      created_ts
      due_date
      taskPriority {
        id
        task_level
      }
      taskStatus {
        id
        status
      }
      taskType {
        task_type
        id
      }
      title
      entity_id
      id
      userByCreatedBy {
        name
      }
    }
  }
  `,
  searchUserByMail: `query searchUserByEmail($email: String) {
    neo_skeleton_user(where: {email: {_ilike: $email}}) {
      id
      email
      failed_login_count
      failed_login_timestamp
    }
  }  
  `,
  searchUserByEmailName: `query searchUserByEmailName($email: String) {
    neo_skeleton_user(where: {email: {_eq: $email}}) {
      id
    }
  }
  `,
  searchUserById: `query searchUserById($id: uuid) {
    neo_skeleton_user(where: {id: {_eq: $id}}) {
      id
      sgid
      email
      name
    }
  }
  `,
  getAppType: `query getAppType($id: uuid) {
    neo_skeleton_lines(where: {id: {_eq: $id}}) {
      id
      appTypeByAppType {
        id
        description
      }
    }
  }
  `,
  getPointAnnot: `
  query getPointAnnotations($from:timestamptz,$to:timestamptz,$metric_key:String,$instrument_id:String){
    neo_skeleton_data_annotations(where: {date: {_gte: $from}, _and: {date: {_lte: $to}, _and: {instrument_id: {_eq: $instrument_id}, _and: {metric_key: {_eq:$metric_key }}}}})
    {
      comments,
      instrument_id,
      metric_key,
      date,
      value
    }
  }
  `,
  checkPointAnnot: `
  query checkPointAnnotations($date:timestamptz,$metric_key:String,$instrument_id:String){
    neo_skeleton_data_annotations(where: {date: {_eq:$date}, _and: {instrument_id: {_eq: $instrument_id}, _and: {metric_key: {_eq:$metric_key }}}})
    {
      comments,
      instrument_id,
      metric_key,
      date,
      value
    }
  }
  `,
  getReportNotification: `
  query getReportNotification($requested_by: uuid,$line_id: uuid, $from: timestamptz, $to: timestamptz,$limit: Int) {
    neo_skeleton_report_generation(where: {requested_by: {_eq: $requested_by}, status: {_eq: 2},line_id:{_eq: $line_id}, created_at: {_gte: $from, _lte: $to}}, limit: $limit) {
      status
      disable
      report_id
      id
      created_at
      report {
        name
        user {
          name
        }
      }
    }
  }
  `,
  getReportNotificationDatewise: `
  query getReportNotificationDatewise($requested_by: uuid, $line_id: uuid, $from: timestamptz, $to: timestamptz) {
    neo_skeleton_report_generation(where: {requested_by: {_eq: $requested_by}, status: {_eq: 2}, line_id: {_eq: $line_id}, created_at: {_gte: $from, _lte: $to}}) {
      status
      disable
      report_id
      id
      created_at
      report {
        name
        user {
          name
        }
      }
    }
  }
  `,
  getReportGenerated: `
  query getReportGenerated($line_id: uuid = "", $requested_by: uuid, $_eq1: Boolean = false ) {
    neo_skeleton_report_generation(where: {line_id: {_eq: $line_id}, disable: {_eq: $_eq1}, requested_by: {_eq: $requested_by}}, order_by: {created_at: desc}) {
      id
      end
      start
      report {
        name
      }
      status
      report_gen_status_master {
        title
      }
      created_at
    }
  }
  `,
  getSavedQualityMetrics: `
  query getSavedQualityMetrics($line_id: uuid) {
    neo_skeleton_quality_metrics(where: {line_id: {_eq: $line_id}}) {
      id,
      parameter 
    }
  }`,
  GetEntityType: `
  query GetEntityType {
    neo_skeleton_entity_types {
      id
      name
    }
  }
  `,
  GetAssetType: `
  query GetAssetType {
    neo_skeleton_asset_types(order_by: {id: asc}) {
      id
      name
    }
  }
  `,
  GetAnalysisType: `
  query GetAnalysisType {
    neo_skeleton_analysis_type(order_by: {id: asc}) {
      id
      name
    }
  }
  `,
  getAssetMetrics: `
  query getAssetMetrics($asset_id: [uuid!]!) {
    neo_skeleton_prod_asset_oee_config(where: {entity: {id: {_in: $asset_id}}}) {
      entity {
        id
        name
      }
      instrument {
        name
        instruments_metrics {
          metric {
            name
            title
            id
          }
          on_change
        }
      }
    }
  }`,
  getInstrumentMetricAnnotations: `
  query getInstrumentMetricAnnotations($instrument_id : String) {
    neo_skeleton_data_annotations(where: {instrument_id: {_eq: $instrument_id}}) {
      instrument_id
    }
  }`,
  getFrequency: `
  query getFrequency($instruments_id : String) {
    neo_skeleton_instruments_metrics(where: {instruments_id: {_eq: $instruments_id}}) {
      frequency
    }
  }
  `,
  checkIfAccessExists: `
  query MyQuery($userId: uuid = "", $lineId: uuid = "") {
    neo_skeleton_user_role_line_aggregate(where: {user_id: {_eq: $userId}, line_id: {_eq: $lineId}}) {
      aggregate {
        count
      }
    }
  }`,
  getEntityRelations: `
  query getEntityRelations($entity_id: uuid) {
    oeeConfig: neo_skeleton_prod_asset_oee_config(where: {entity_id: {_eq: $entity_id}}) {
      id: entity_id
    }
    execution: neo_skeleton_prod_exec(where: {entity_id: {_eq: $entity_id}}) {
      id: entity_id
    }
    downtime: neo_skeleton_prod_outage(where: {entity_id: {_eq: $entity_id}}) {
      id: entity_id
    }
    partComment: neo_skeleton_prod_part_comments(where: {asset_id: {_eq: $entity_id}}) {
      id: asset_id
    }
    qualityDefects: neo_skeleton_prod_quality_defects(where: {entity_id: {_eq: $entity_id}}) {
      id: entity_id
    }
    tasks: neo_skeleton_tasks (where: {entity_id: {_eq: $entity_id}}){
      id: entity_id
    }
    assetInfo: neo_skeleton_entity_info(where: {entity_id: {_eq: $entity_id}}) {
      id: entity_id
    }
    maintenancelogs: neo_skeleton_maintenance_log(where: {entity_id: {_eq: $entity_id}}) {
      id: entity_id
    }
    entityInstruments: neo_skeleton_entity_instruments(where: {entity_id: {_eq: $entity_id}}) {
      id: entity_id
    }
    dryerConfig: neo_skeleton_dryer_config(where: {entity_id: {_eq: $entity_id}}) {
      id: entity_id
    }
  }
  `,
  getOfflineInstrumentList: `
  query getOfflineInstrumentList($line_id: uuid) {
    neo_skeleton_instruments(where: {line_id: {_eq: $line_id},is_offline: {_eq: true}}) {
      id
      name
      instrument_type      
      is_offline 
      updated_ts
      instrument_category {
        id
        name
      }
      instrumentTypeByInstrumentType {
        id
        name
      } 
      userByUpdatedBy {
        id
        name
      } 
      instruments_metrics {
        frequency
        metric {
          id
          name
          title
          metricDatatypeByMetricDatatype {
            type
          }

        }
      }
         entity_instruments {
      entity_id
       entity_instruments {
        name
      }
    }
    }
  }
  `,
  getRequestAccesscount: `
  query getRequestAccesscount($lineId: uuid = "", $userId: uuid = "") {
    neo_skeleton_user_request_access_aggregate(where: {line_id: {_eq: $lineId}, created_by: {_eq: $userId}, reject: {_eq: false}, approve: {_eq: false}}) {
      aggregate {
        count
      }
    }
  }
  
  `,
  getRequestRejectcount: `
  query getRejectcount($lineId: uuid, $userId: uuid, $toDate: timestamptz ) {
    neo_skeleton_user_request_access(where: {line_id: {_eq: $lineId}, reject: {_eq: true}, created_by: {_eq: $userId}, reviewed_ts: {_gt: $toDate}}) {
      reject
      reviewed_by
      reviewed_ts
    }
  }
  `,

  getMaintainceLog: `query getMaintainceLog($LineId: uuid = "", $from: timestamptz = "", $to: timestamptz = "") {
    neo_skeleton_maintenance_log(where: {line_id: {_eq: $LineId}, created_ts: {_lte: $to, _gte: $from}}) {
      line {
        id
        name
      }
      entity {
        id
        name
      }
      user {
        name
        id
      }
      log
      created_by
      created_ts
    }
  }`,

  getMaintenanceLogsHistory: `
  query getMaintenanceLogsHistory($entity_id: uuid, $from: timestamptz, $to: timestamptz) {
    neo_skeleton_maintenance_log(where: {entity_id: {_eq: $entity_id}, created_ts: {_gte: $from}, _and: {created_ts: {_lte: $to}}}, order_by: {created_ts: desc}) {
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
  `,
  getReasonTags: `
  query getReasonTags($line_id : uuid) {
    neo_skeleton_prod_reason_tags(where: {line_id: {_eq: $line_id}}) {
      id
      reason_tag
      reason_type
    }
  }`,
  getLastConnectivity: `
    query getLastConnectivity($instrument_id: [String!]) {
    neo_skeleton_connectivity(
      where: {instrument_id: {_in: $instrument_id}}, 
      order_by: {last_check_time: desc}, 
    ) {
      last_state
      last_check_time
    }
  }
  `,
  getInsClass: `
    query getInsClass($entity_id: uuid = "") {
    neo_skeleton_instruments(where: {entity_instruments: {entity_id: {_eq: $entity_id}}}) {
      id
      instrumentClassByInstrumentClass {
        class
      }
    }
  }
  `,
  getLastAlert: `
    query getLastAlert($instrument_id: [String!]) {
    neo_skeleton_alerts_v2(
      where: {instruments_metric: {instruments_id: {_in: $instrument_id}}},
      order_by: {last_check_time: desc}, 
      limit: 1
    ) {
      current_state
      last_check_time
    }
  }
  `,
  getProductQuantity: `
  query getProductQuantity($start_dt: timestamptz, $line_id: uuid, $end_dt: timestamptz) {
    neo_skeleton_prod_exec(where: {start_dt: {_gte: $start_dt}, _and: {line_id: {_eq: $line_id}, _and: {start_dt: {_lte: $end_dt}}}}) {
      start_dt
      end_dt
      prod_order {
        order_id
        prod_product {
          id
          name
          info
        }
      }
      info
    }
  }`,
  getAssetListOnly: `
  query getAssetListOnly($line_id: uuid) {
    neo_skeleton_entity(where: {entity_type: {_eq: 3}, line_id: {_eq: $line_id}}, order_by: {name: asc}) {
      id
      name
      analysis_types

    }
  }
  `,
  getVirtualInstrumentFormula: `
  query getVirtualInstrumentFormula ($VIID : [uuid!]){
    neo_skeleton_virtual_instruments(where: {id: {_in: $VIID }}) {
      id
      name
      formula
    }
  }
  `,
  getMetricType: `
  query getMetricType {
    neo_skeleton_metrics {
      metric_type {
        id
        type
      }
      name
      instrument_type
    }
  }`,
  getAssetEnergy: `
  query getAssetEnergy($line_id: uuid) {
    neo_skeleton_instruments_metrics(where: {metric: {name: {_like: "%kwh%"}}, instrument: {line_id: {_eq: $line_id}}}) {
      instrument {
        id
        name
        line_id
      }
      metric {
        id
        name
      }
    }
  }
  `,
  connectivityList: `
  query ConnectivityList($line_id: uuid) {
    neo_skeleton_connectivity(where: {line_id: {_eq: $line_id}}) {
      id
      name
      instrument_id
      instrument {
        name
      }
      check_type
      check_last_n
      alert_users
      alert_channels
      delivery  
    }
  }
  `,
  AnalyticConfigList: `
  query AnalyticConfigList {
    neo_skeleton_prod_asset_analytics_config {
      config
      entity_id
      id
    }
  }
  `,
  getAssetCountPlantWise: `
  query GetAssetCountPlantWise($line_id: uuid, $instrument_type: Int = 10) {
    neo_skeleton_entity_aggregate(where: {entity_type: {_eq: 3}, line_id: {_eq: $line_id}, entity_instruments: {instrument: {instrument_type: {_eq: $instrument_type}}}}) {
      aggregate {
        count
      }
    }
  }
  `,
  getTaskDataAssetWise: `
  query getTaskDataAssetWise($fromDate: timestamptz = "", $toDate: timestamptz = "", $line_id: uuid = "", $id: bigint = "") {
    neo_skeleton_tasks(where: {reported_date: {_gte: $fromDate, _lte: $toDate}, instrument: {line_id: {_eq: $line_id}, instrumentTypeByInstrumentType: {id: {_eq: $id}}}}) {
      reported_date
      instrument_status_type {
        status_type
      }
      instrument {
        instrumentClassByInstrumentClass {
          class
        }
      }
      reported_by
      observed_date
      entity_id
      userByObservedBy {
        name
      }
      userByReportedBy {
        name
      }
    }
  }
`,
  getTaskWiseAssetStatus: `
  query getTaskWiseAssetStatus($entity_id: [uuid!]!, $id: bigint = "") {
  neo_skeleton_tasks(where: {entity_id: {_in: $entity_id}, status: {_neq: 3}, instrument: {instrumentTypeByInstrumentType: {id: {_eq: $id}}}}, order_by: [{reported_date: desc}, {priority: asc}]) {
    entity_id
    id
    instrument_status_type_id
    reported_date
    status
    due_date
    priority
  }
}
  `,
  getGroupMetrics: `
  query getGroupMetrics($line_id: uuid = "") {
  neo_skeleton_metrics_group(where: {line_id: {_eq: $line_id}}) {
    access
    group_limit
    grpname
    id
    line_id
    lower_limit
    metrics
    shared_users
    updated_by
    created_by
    updated_ts
    upper_limit
  }
}
 `,
  GetAssetPlantWise: `
   query GetAssetPlantWise($line_id: uuid, $instrument_type: Int = 10) {
    neo_skeleton_entity(where: {entity_type: {_eq: 3}, line_id: {_eq: $line_id}, entity_instruments: {instrument: {instrument_type: {_eq: $instrument_type}}}}) {
      id
    }
  }
 `,
  getaggregate: `query getaggregate($id: uuid) {
  neo_skeleton_alerts_v2(where: {id: {_eq: $id}}) {
    check_aggregate_window_function
  }
}
`,
  alertConfigurations: `
 query alertList($line_id: uuid) {
  neo_skeleton_connectivity(where: {line_id: {_eq: $line_id}}) {
    id
    name
    instrument_id
    instrument {
      name
    }
    gateway_id
    gateway {
      name
    }
    check_type
    check_last_n
    alert_users
    alert_channels
    delivery
    userByUpdatedBy {
      name
    }
    connectivity_type
  }
  neo_skeleton_alerts_v2(where: {line_id: {_eq: $line_id}}) {
    check_aggregate_window_function
    check_aggregate_window_time_range
    check_id
    check_start_time
    check_time
    check_time_offset
    critical_max_value
    critical_min_value
    critical_type
    time_slot_id
    critical_value
    delivery
    id
    ok_max_value
    ok_min_value
    ok_type
    ok_value
    current_state
    virtual_instrument {
      id
      name
    }
    instruments_metric {
      metric {
        id
        name
        title
      }
      instrument {
        id
        name
        entity_instruments {
          entity_instruments {
            id
            name
          }
        }
      }
    }
    insrument_metrics_id
    name
    warn_max_value
    warn_min_value
    warn_type
    warn_value
    status
    entity_type
    alert_channels
    alert_users
    userByUpdatedBy {
      name
    }
    check_last_n
    check_type
    message
    viid
    product_id
    is_prod_id_available
    alertByproduct {
      id
      name
    }
    alert_multi_channels
    misc
    warn_frequency
    recurring_alarm
    cri_frequency
  }
}

  `,
  alertDashboard:`query alertList($line_id: uuid) {
  neo_skeleton_alerts_v2(where: {line_id: {_eq: $line_id}}) {
    critical_max_value
    critical_min_value
    critical_type
    critical_value
    id
    instruments_metric {
      metric {
        id
        name
        title
      }
      instrument {
        id
        name
      }
    }
    insrument_metrics_id
    name
    warn_max_value
    warn_min_value
    warn_type
    warn_value
    viid
    entity_type
 
  }
}`,
  DashboardList: `
  query DashboardList($line_id: uuid, $user_id: uuid) {
    neo_skeleton_dashboard(where: {_not: {id: {_in: ["6f3173c7-f884-4535-b0b0-4d6a4b97f863","ab0cb71d-36b0-4ac2-9e3d-43e01f55714d"]}}}) {
      id
      custome_dashboard
      user_access_list
      standard
      datepicker_type
      dashboard
      layout
      line_id
      last_opened
      name
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
    neo_skeleton_user_default_dashboard(where: {user_id: {_eq: $user_id}, _and: {line_id: {_eq: $line_id}, _not: {dashboard_id: {_in: ["6f3173c7-f884-4535-b0b0-4d6a4b97f863", "ab0cb71d-36b0-4ac2-9e3d-43e01f55714d"]}}}}){
      line_id
      dashboard {
        id
        name
        dashboard
        layout
      }
    }
  }
  `,
  getAssetOEEConfigsofLine: `
  query getAssetOEEConfigsofLine ($line_id: uuid) {
    neo_skeleton_prod_asset_oee_config(where: {instrument: {line_id: {_eq: $line_id}}}) {
      id
      is_part_count_binary
      is_part_count_downfall
      machine_status_signal
      machine_status_signal_instrument
      part_signal_instrument
      planned_downtime
      part_signal
      instrument {
        id
        name
        line {
          id
          name
        }
      }
      entity {
        id
        name
        line {
          id
          name
        }
        
      }
    }
  }
  `,
  getProductOutage: `
  query getProductOutage( $start_dt: timestamptz, $end_dt: timestamptz, $line_id: uuid) {
    neo_skeleton_prod_outage(where: { start_dt: {_gte: $start_dt}, _and: {end_dt: {_lte: $end_dt}, _and: {line_id: {_eq: $line_id}}}}) {
      created_ts
      end_dt
      start_dt
      prod_order {
        order_id
        id
        prod_product {
          name
          id
          product_id
        }
      }
      prod_reason {
        reason
        id
      }
    }
  }
  `
  ,
  getProductionWorkOrderExecutions: `query getProductionWorkOrderExecutions($asset_id: uuid, $from: timestamptz, $to: timestamptz) {

    neo_skeleton_prod_exec(where: {start_dt: {_lte: $to}, _and: {end_dt: {_gte: $from}, _and: {entity_id: {_eq: $asset_id}}}}) {
      id
      status
      start_dt
      end_dt
      entity {
        id
        name
        dryer_config{
          is_enable
        }
      }
      prod_order {
        prod_product {
          unit
          product_id
          name
          expected_energy
          moisture_in
          moisture_out
          is_micro_stop
          mic_stop_from_time
          mic_stop_to_time
        }
        id
        qty
        order_id
      }
      operator_id
      userByOperatorId {
        name
        id
      }
    }
  }`,
  getProductionWorkOrderExecutionsLive: `query getProductionWorkOrderExecutionsLive($asset_id: uuid ,$to: timestamptz) {

    neo_skeleton_prod_exec(where: {start_dt: {_lte: $to} ,_or:{end_dt:{_is_null: true}, _and: {entity_id: {_eq: $asset_id}}}}) {
      id
      status
      start_dt
      end_dt
      entity {
        id
        name
        dryer_config{
          is_enable
        }
      }
      prod_order {
        prod_product {
          unit
          product_id
          name
          expected_energy
          moisture_in
          moisture_out
          is_micro_stop
          mic_stop_from_time
          mic_stop_to_time
        }
        id
        qty
        order_id
      }
      operator_id
      userByOperatorId {
        name
        id
      }
    }
  }`,
  getAssetQualityDefectsBasedonProduction: `query getAssetQualityDefects($asset_id: uuid, $from: timestamptz, $to: timestamptz) {
    neo_skeleton_prod_quality_defects(where: {marked_at: {_lte: $to}, _and: {marked_at: {_gte: $from}, _and: {entity_id: {_eq: $asset_id}}}}) {
      id
      quantity
      updated_ts
      comments
      prod_order {
        id
        order_id
      }
      prod_reason {
        id
        reason
        prod_reason_type {
          id
          reason_type
        }
      }
    }
  }`,
  getDefectsSeverity: `query getDefectsSeverity {
    neo_skeleton_defects_severity {
      id
      severity_type
    }
  }
  `,
  getDefectsInfo: `query getDefectsInfo {
    neo_skeleton_defects {
      defect_id
      defect_name
      observation
    }
  }`,


  getLineHeirarchy: `query getLineHeirarchy($LineID: uuid ) {
    neo_skeleton_lines_hierarchy(where: {parent_line_id: {_eq: $LineID}}) {
      child_line_ids
      id
      parent_line_id
    }
  }
  
  `,
  getLineWO: `
  query getLineWO($line_id: uuid = "" ) {
    neo_skeleton_prod_order(where: {line_id: {_eq: $line_id}}) {
      order_id
      start_dt
      end_dt
      prod_product {
        id
        name
      }
      user {
        name
      }
      prod_execs {
        entity {
          status
      timestamp
    }
  }
  `,

  getLineWorkOrder:`
  query getLineWO($line_id: uuid) {
    neo_skeleton_prod_order(where: {line_id: {_eq: $line_id}}) {
      id
    order_id
    product_id
    start_dt
    end_dt
    prod_execs {
      id
      start_dt
      end_dt
      entity_id
    }
    }
  }
  
  `,
  getLicenseDetails: `
    query getLicenseDetails($line_id: uuid) {
      neo_skeleton_licensing_table(where: {line_id: {_eq: $line_id}}) {
        line_id
        expiry_date
        expiry_remainder
      }
    }
  `,

  getForeCastNotifications: `
  query getForeCastNotifications($from: timestamptz, $to: timestamptz) {
    neo_skeleton_instruments_metrics_forecasting(where: {timestamp: {_gte: $from}, _and: {timestamp: {_lte: $to}}}) {
      ins_met_is
      instruments_metric {
        instrument {
          id
          line_id
          name
        }
        metric {
          id
          name
        }
      }
    }
  }
  `,
  getInsMetrics: `
  query getInsMetrics($instruments_id: String = "") {
    neo_skeleton_instruments_metrics(where: {instruments_id: {_eq: $instruments_id}}) {
      metric {
        title
        name
      }
    }
  }
  `,
  getEntityInstrumentsListWithEntityID: `
    query getEntityInstrumentsListWithEntityID($entity_id: [uuid!]!, $instrument_type: Int = 10) {
    neo_skeleton_entity_instruments(where: {
      entity_id: {_in: $entity_id}, 
      instrument: {instrument_type: {_eq: $instrument_type}} 
    }) {
      instrument_id
      instrument {
        id
        name
      }
    }
  }
  `,
  getmetricname: `
  query getmetricname($name: String = "") {
  neo_skeleton_metrics(where: {name: {_eq: $name}}) {
    title
  }
}
  `,
  getInstrumentWithEntityId:`
query getInstrumentWithEntityId($entity_id: uuid) {
  neo_skeleton_entity_instruments(where: {entity_id: {_eq: $entity_id}}) {
    entity_id
    instrument_id
    instrument {
      name
      id
    }
  }
}`,
  getEntityInstrumentsList: `query getEntityInstrumentsList ($line_id: uuid = "") { 
    neo_skeleton_entity_instruments(where: {line_id: {_eq: $line_id}}) { 
      entity_id 
      instrument_id 
      line_id 
      entity_instruments { 
        id 
        name 
      } 
      instrument { 
        id 
        name 
        instrument_type
        is_offline 
        instrument_category { 
          id 
          name 
        } 
        instrumentTypeByInstrumentType { 
          id 
          name 
        }  
        userByUpdatedBy { 
          id 
          name 
        }  
        instruments_metrics { 
          frequency 
          metric { 
            id 
            name 
            title 
          } 
        }  
      } 
      line { 
        id 
        name 
      } 
    } 
  }`,

  getFaultModeList: `query getFaultModeList { 
    neo_skeleton_fault_mode { 
      id 
      name 
      fault_class_id
    } 
  }`,
  getFaultClassificationList: `query getFaultClassificationList { 
    neo_skeleton_fault_classification { 
      id 
      name 
    } 
  }`,

  GetDryerEntityList: `
  query GetDryerEntityList($line_id: uuid) {
    neo_skeleton_entity(where: {line_id: {_eq: $line_id}, dryer_config: {is_enable: {_eq: true}}}, order_by: {name: asc}) {
      id
      name
      entity_type
      asset_types
      analysis_types
      created_ts
      entity_instruments(where: {}) {
        entity_id
        instrument_id
      }
      dryer_config {
        entity_id
        id
        is_enable
      }
    }
  }
  `,
  getProductUnit: `
    query MyQuery {
      neo_skeleton_metric_unit(where: {product_units: {_eq: true}}) {
        id
        unit
      }
    }
  `,
  getDryerCountForLine: `
    query MyQuery($line_id: uuid) {
      neo_skeleton_dryer_config_aggregate(where: {line_id: {_eq: $line_id}, is_enable: {_eq: true}}) {
        aggregate {
          count
        }
      }
    }
  `,
  getInstrumentMetrics: `
    query getInstrumentMetrics($line_id: uuid = "") {
      neo_skeleton_instruments_metrics(where: {instrument: {line_id: {_eq: $line_id}}}) {
        instruments_id
        metric {
          id
          name
          title
        }        
        instrument {
          name
        }
      }
   

  }`,


  getRealVirtualInstruments: `query MyQuery($line_id: uuid) {
    neo_skeleton_instruments(where: {line_id: {_eq: $line_id}}) {
      id
      name
    }
    neo_skeleton_virtual_instruments(where: {line_id: {_eq: $line_id}}) {
      id
      name
      formula
    }
  }
  `,
  getFaultRecommendations: `
  query getFaultRecommendations {
    neo_skeleton_fault_action_recommended {
      action_recommended
      defect_id
      id
      severity_id
    }
  }
  `,
  getSensorDetails: `
 query getSensorDetails($line_id: uuid) {
  neo_skeleton_sensors(where: {instrument: {line_id: {_eq: $line_id}}}) {
    updated_at
    tech_name
    tech_id
    rpm
    min_rpm
    max_rpm
    id
    number
    axis
    order
    iid
    latest_severity
    latest_defect_code
    defect_processed_at
    db_name
    bearing_defect_factors
    instrument {
      id
      line_id
      name
      entity_instruments {
        entity_id
      }
    }
    predicted_rpm
    enable
    vfd
    location
    type
    intermediate
    domain
  }
}
  `,
  getResources:
    `query getResources {
    neo_skeleton_resources {
      id
      resource
    }
  }
  `,
  getInstrumentStatusList:
    `query getInstrumentStatusList {
    neo_skeleton_instrument_status_type {
      id
      status_type
    }
  }
  `,
  getGateWay:
    `
  query getGateWay($line_id: uuid) {
  neo_skeleton_gateway(where: {line_id: {_eq: $line_id}}) {
    id
    iid
    ip_address
    location
    name
    instrument_id
    created_ts
    user {
      name
    }
    gateway_instrument
    end_point_url
  }
}

  `
  ,

  getGateWayInstrumentDetail:`
  query getGateWayInstrumentDetail($gateway_id: uuid) {
  neo_skeleton_gateway_instruments(where: {gateway_id: {_eq: $gateway_id}}) {
    com_setting_id
    instrument_id
    gateway_id
    make
    model
    model_number_id
    slave_id
    mqtt_id
    updated_by
    updated_ts
    en_dis
     user {
      name
    }
  }
}

  `,
  getOnlineInstruments: `
query getOnlineInstruments($line_id: uuid) {
  neo_skeleton_instruments(where: {line_id: {_eq: $line_id}, is_offline: {_eq: false}}) {
    id
    is_offline
    category
    instrument_type
    name
    instrumentTypeByInstrumentType {
      name
    }
    instruments_metrics {
      metric {
        name
        id
        metric_datatype
        title
        props
      }
    }
    
  }
}

`,
  GetSteelAssetCount: `
  query GetSteelAssetCount($line_id: uuid) {
    neo_skeleton_entity_aggregate(where: {line_id: {_eq: $line_id}, asset_types: {_eq: 13}}) {
      aggregate {
        count
      }
    }
  }
  `,
  getSteelAssetsList: `
  query getSteelAssetsList($line_id: uuid) {
    neo_skeleton_entity(where: {entity_type: {_eq: 3}, line_id: {_eq: $line_id}, asset_types: {_eq: 13}}, order_by: {name: asc}) {
      id
      name
    }
  }
  `,
  getSteelAssetList: `
  query getSteelAssetList($line_id: uuid) {
    neo_skeleton_entity(where: {entity_type: {_eq: 3}, line_id: {_eq: $line_id}, asset_types: {_eq: 13}, spindle_speed_threshold: { _is_null: false }, feed_rate_threshold: { _is_null: false }}, order_by: {name: asc}) {
      id
      name
    }
  }
  `,
  getCNCAssetList: `
  query getCNCAssetList($line_id: uuid) {
    neo_skeleton_entity(where: { entity_type: {_eq: 3}, line_id: {_eq: $line_id}, asset_types: {_eq: 8}}, order_by: {name: asc}) {
      id
      name
    }
  } 
  `,
  getSteelProducts: `
  query getSteelProducts {
    neo_skeleton_steel_products {
      id
      name
    }
  }
  `,
  getSteelAssetConfig: `
  query getSteelAssetConfig($line_id: uuid) {
    neo_skeleton_steel_asset_config(where: {line_id: {_eq: $line_id}}) {
      id
      entity_id
      form_layout
      calculations
      line_id
      steel_product_id
      created_by
      created_ts
      entity {
        id
        name
        prod_asset_oee_configs {
          part_signal_instrument
          part_signal
          planned_downtime
          setup_time
          is_part_count_binary
          is_part_count_downfall
          is_status_signal_available
          metric {
            id
            name
          }
          entity {
            entity_instruments {
              instrument_id
            }
          }
        }
      }
      steel_product {
        id
        name
      }
      user {
        name
      }
    }
  }
  
  `,
  getAllTaskListByRange:
    `query getAllTaskListByRange($line_id: uuid, $from: timestamptz, $to: timestamptz, $categoryID: Int = 3) {
    neo_skeleton_tasks(where: {entityId: {line_id: {_eq: $line_id}}, observed_date: {_gte: $from, _lte: $to}, instrument: {instrumentTypeByInstrumentType: {instrument_category: {id: {_eq: $categoryID}}}}}) {
      task_id
      id
      entity_id
      priority
      status
      title
      type
      assingee
      created_by
      due_date
      description
      created_ts
      updated_by
      updated_ts
      action_taken
      action_recommended
      action_taken_date
      comments
      observed_date
      taskStatus {
        id
        status
      }
      taskType {
        id
        task_type
      }
      taskPriority {
        id
        task_level
      }
      entityId {
        id
        name
        line_id
      }
      userByAssignedFor {
        email
        id
        name
      }
      userByObservedBy {
        id
        name
      }
      userByReportedBy {
        id
        name
      }
      analysis_type {
        id
        name
      }
      userByCreatedBy {
        name
      }
      tasksAttachements {
        image_path
      }
      task_feedback_action {
        feedback_action
      }
      instrument {
        id
        name
        instrumentTypeByInstrumentType {
          id
          name
        }
        instrument_category {
          id
          name
        }
      }
      faultModeByFaultMode {
        id
        name
      }
      instrument_status_type {
        id
        status_type
      }
    }
  }
  `,


  getEntityAssetByCategory:
    `query getEntityAssetByCategory($line_id: uuid, $categoryID: Int = 3) {
    neo_skeleton_entity(where: {line_id: {_eq: $line_id}}) {
      id
      name
      line_id
      entity_instruments(where: {instrument: {instrument_category: {id: {_eq: $categoryID}}}}) {
        instrument {
          instrumentTypeByInstrumentType {
            id
            name
            instrument_category {
              id
              name
            }
          }
        }
      }
    }
  }
  
  `,
  getSteelAssetProductCount: `
  query getSteelAssetProductCount($entity_id: uuid, $product_id: Int) {
      neo_skeleton_steel_asset_config_aggregate(where: {_and: {entity_id: {_eq: $entity_id}, steel_product_id: {_eq: $product_id}}}) {
        aggregate {
          count
      }
    }
  }
  `,
  getTaskOpenGT3M:
    `query getTaskOpenGT3M($line_id: uuid, $date: timestamptz, $categoryID: Int = 3, $taskStatusID: Int = 3) {
    neo_skeleton_tasks(where: {entityId: {line_id: {_eq: $line_id}}, instrument: {instrumentTypeByInstrumentType: {instrument_category: {id: {_eq: $categoryID}}}}, observed_date: {_lt: $date}, status: {_neq: $taskStatusID}}) {
      task_id
      id
      entity_id
      priority
      status
      title
      type
      assingee
      created_by
      description
      created_ts
      observed_date
      taskStatus {
        id
        status
      }
      taskType {
        id
        task_type
      }
      taskPriority {
        id
        task_level
      }
      entityId {
        id
        name
        line_id
      }
      instrument {
        id
        name
        instrumentTypeByInstrumentType {
          id
          name
        }
        instrument_category {
          id
          name
        }
      }
      instrument_status_type {
        id
        status_type
      }
    }
  }
  `,
  getSteelDataByTime: `
  query getSteelDataByTime($time:timestamptz) {
    neo_skeleton_steel_data(where: {time: {_eq: $time}}) {
      key
      entity_id
      time
      value
    }
  }
  `,
  getSteelAssetData: `
  query getSteelAssetDataById($entity_id:uuid){
    neo_skeleton_steel_data(where: {entity_id: {_eq: $entity_id}}){
      key
      entity_id
      time
      value
    }
  }
  `,
  getHighPriorityAssetGT1M:
    `query getHighPriorityAssetGT1M($line_id: uuid, $date: timestamptz, $categoryID: Int = 3, $taskStatusID: Int = 3, $taskPriorityID: Int = 12) {
    neo_skeleton_tasks(where: {entityId: {line_id: {_eq: $line_id}}, instrument: {instrumentTypeByInstrumentType: {instrument_category: {id: {_eq: $categoryID}}}}, observed_date: {_lt: $date}, status: {_neq: $taskStatusID}, priority: {_eq: $taskPriorityID}}) {
      task_id
      id
      entity_id
      priority
      status
      title
      type
      assingee
      created_by
      description
      created_ts
      observed_date
      taskStatus {
        id
        status
      }
      taskType {
        id
        task_type
      }
      taskPriority {
        id
        task_level
      }
      entityId {
        id
        name
        line_id
      }
      instrument {
        id
        name
        instrumentTypeByInstrumentType {
          id
          name
        }
        instrument_category {
          id
          name
        }
      }
      instrument_status_type {
        id
        status_type
      }
    }
  }
  `,

  getDueDateExpiredTaskGT60:
    `query getDueDateExpiredTaskGT60($due_date: timestamptz, $line_id: uuid, $taskStatus: [Int!] = [21,3]) {
      neo_skeleton_tasks (where : {due_date: {_lt: $due_date}, entityId: {line_id: {_eq: $line_id}}, status: {_nin: $taskStatus}}) {
        created_by
        created_ts
        due_date
        taskPriority {
          id
          task_level
        }
        taskStatus {
          id
          status
        }
        taskType {
          task_type
          id
        }
        title
        entity_id
        id
        userByCreatedBy {
          name
        }
      }
    }`,

  getMainComponentMaster:
    `query getMainComponentMaster {
  neo_skeleton_task_main_component_master {
    id
    description
  }
}`,

  getSubComponentMaster:
    `query getSubComponentMaster($mcc_id: uuid) {
  neo_skeleton_task_sub_component_master(where: {task_feedback_actions: {mcc_id: {_eq: $mcc_id}}}) {
    id
    description
  }
}`,
  getSubComponentListMaster:
    `query getSubComponentListMaster{
  neo_skeleton_task_sub_component_master {
    id
    description
  }
}`
  ,
  alertCount: `
query alertCount($line_id: uuid, $instrument_category: [Int!]) {
  neo_skeleton_connectivity_aggregate(where: {line_id: {_eq: $line_id}, instrument: {category: {_in: $instrument_category}}}) {
    aggregate {
      count
    }
  }
  neo_skeleton_alerts_v2_aggregate(where: {line_id: {_eq: $line_id}, instruments_metric: {instrument: {instrument_category: {id: {_in: $instrument_category}}}}}) {
    aggregate {
      count
    }
  }
}
`,

timeSlotAlertCount:`
query timeSlotAlertCount($entity_type: String, $line_id: uuid, $instrument_category: [Int!]) {
  neo_skeleton_alerts_v2_aggregate(where: {line_id: {_eq: $line_id}, entity_type: {_eq: $entity_type}, instruments_metric: {instrument: {instrument_category: {id: {_in: $instrument_category}}}}}) {
    aggregate {
      count
    }
  }
}
`,
toolAlertCount:`
query toolAlertCount($entity_type: String, $line_id: uuid, $instrument_category: [Int!]) {
  neo_skeleton_alerts_v2_aggregate(where: {line_id: {_eq: $line_id}, entity_type: {_eq: $entity_type}, instruments_metric: {instrument: {instrument_category: {id: {_in: $instrument_category}}}}}) {
    aggregate {
      count
    }
  }
}
`,
alert1Count: `
  query alert1Count($line_id: uuid, $instrument_category: [Int!], $start_date: timestamptz, $end_date: timestamptz) {
    neo_skeleton_connectivity_aggregate(where: {line_id: {_eq: $line_id}, instrument: {category: {_in: $instrument_category}, created_ts: {_gte: $start_date, _lte: $end_date}}}) {
      aggregate {
        count
      }
    }
    neo_skeleton_alerts_v2_aggregate(where: {line_id: {_eq: $line_id}, instruments_metric: {instrument: {instrument_category: {id: {_in: $instrument_category}}}}, created_ts: {_gte: $start_date, _lte: $end_date}}) {
      aggregate {
        count
      }
    }
  }
`,

timeSlot1AlertCount:`
query timeSlot1AlertCount($entity_type: String, $line_id: uuid, $instrument_category: [Int!], $start_date: timestamptz, $end_date: timestamptz) {
  neo_skeleton_alerts_v2_aggregate(where: {line_id: {_eq: $line_id}, entity_type: {_eq: $entity_type}, instruments_metric: {instrument: {instrument_category: {id: {_in: $instrument_category}}}}, created_ts: {_gte: $start_date, _lte: $end_date}}) {
    aggregate {
      count
    }
  }
}
`,
toolAlert1Count:`
query toolAlert1Count($entity_type: String, $line_id: uuid, $instrument_category: [Int!], $start_date: timestamptz, $end_date: timestamptz) {
  neo_skeleton_alerts_v2_aggregate(where: {line_id: {_eq: $line_id}, entity_type: {_eq: $entity_type}, instruments_metric: {instrument: {instrument_category: {id: {_in: $instrument_category}}}}, created_ts: {_gte: $start_date, _lte: $end_date}}) {
    aggregate {
      count
    }
  }
}
`,
toolAlertRules:`
query toolAlertRules($entity_type: String, $line_id: uuid) {
  neo_skeleton_alerts_v2(where: {line_id: {_eq: $line_id}, entity_type: {_eq: $entity_type}}) {
    critical_value
      id
      instruments_metric {
        metric {
          id
          name
          title
        }
        instrument {
          id
          name
        }
      }
      insrument_metrics_id
      name  
      warn_value 
      entity_type
  }
}
`,
InstrumentWiseAlert:`
query InstrumentWiseAlert ($insrument_metrics_id: [Int!]) {
  neo_skeleton_alerts_v2(where: {insrument_metrics_id: {_in: $insrument_metrics_id}}) {
    id
    insrument_metrics_id
    name
  }
}
`,

InstrumentWiseMetric:`
query InstrumentWiseMetric ($name: String, $title: String) {
  neo_skeleton_metrics(where: {name: {_eq: $name}, title: {_eq: $title}}) {
    id
    name
  }
}
`,

downtimeAlertCount:`
query downtimeAlertCount($entity_type: String, $line_id: uuid, $instrument_category: [Int!]) {
  neo_skeleton_alerts_v2_aggregate(where: {line_id: {_eq: $line_id}, entity_type: {_eq: $entity_type}, instruments_metric: {instrument: {instrument_category: {id: {_in: $instrument_category}}}}}) {
    aggregate {
      count
    }
  }
}
`,
  alertComparisonList: `
query alertComparisonList($line_id: uuid) {
  neo_skeleton_entity(where: {line_id: {_eq: $line_id}, entity_instruments: {instrument: {id: {_is_null: false}}}}) {
    id
    name
    entity_instruments {
      instrument {
        id
        name
      }
    }
  }
  neo_skeleton_virtual_instruments(where: {line_id: {_eq: $line_id}}) {
    id
    name
  }
  neo_skeleton_instruments {
    id
    name
    entity_instruments {
      entity_instruments {
        id
        name
      }
    }
  }
}
`,
  getAlarmAcknowledgementByType: `
query getAlarmAcknowledgementByType($line_id: uuid, $type: String) {
  neo_skeleton_alarm_acknowledgement(where: {line_id: {_eq: $line_id}, type: {_eq: $type}}) {
    id
    name
  }
}
`,
getZonesByLine: `
query getZonesByLine($line_id: uuid = "") {
  neo_skeleton_entity(where: {is_zone: {_eq: true}, line_id: {_eq: $line_id}}) {
    id
    name
  }
}
`,
getAssetsByzone: `
query getAssetsByzone($entity_id: [uuid!]) {
  neo_skeleton_node_zone_mapping(where: {entity_id: {_in: $entity_id}}) {
    entity_id
    asset_id
  }
}
`,
getTaskdetailsByEntity: `
query getTaskdetailsByEntity($entity_id: [uuid!], $start_date: timestamptz!, $end_date: timestamptz!) {
  neo_skeleton_tasks(where: {entity_id: {_in: $entity_id}, reported_date: {_gte: $start_date, _lte: $end_date}}, order_by: {reported_date: desc}) {
    reported_date
    instrument_status_type_id
    instrument_status_type {
      status_type
    }
    entity_id
    fault_mode
    faultModeByFaultMode {
      name
    }
  }
}
`,
getOverallTaskData:`
query getOverallTaskData($line_id: uuid, $start_date: timestamptz, $end_date: timestamptz, $instrument_type: Int = 10) {
  neo_skeleton_tasks(where: {entityId: {line_id: {_eq: $line_id}}, reported_date: {_gte: $start_date, _lte: $end_date}, instrument: {instrument_type: {_eq: $instrument_type}}}) {
    id
    entity_id
    taskStatus {
      id
      status
    }
    instrument_status_type {
      id
      status_type
    }
    reported_date
  }
}
`,
getFaultAcknowledgementByType: `
query getFaultAcknowledgementByType($line_id: uuid) {
  neo_skeleton_fault_acknowledgement(where: {line_id: {_eq: $line_id}}) {
    id
    name
  }
}
`,
  getContractEntity:
    `query getContractEntity($line_id: uuid) {
    neo_skeleton_entity(where: {entity_type: {_eq: 4}, line_id: {_eq: $line_id}}, order_by: {name: asc}) {
      id
      name
    }
  }
  `,
  getCurrentShiftOperator:
  `
  query getCurrentShiftOperator($entity_id: uuid, $start: timestamptz, $end: timestamptz) {
    neo_skeleton_prod_operator(where: {entity_id: {_eq: $entity_id}, start: {_gte: $start, _lt: $end}}) {
      id
      entity_id
      operator_id
      start
      end
    }
  }
  `,
  getLineWOSelectedTime:`
  query getLineWOSelectedTime($line_id: uuid, $start: timestamptz) {
    neo_skeleton_prod_order(where: {line_id: {_eq: $line_id}, start_dt: {_gte: $start}}) {
      order_id
      product_id
      start_dt
      end_dt
    }
  }
  
  
  `,
  getExecutionForCurrentTime:`
  query getExecutionForCurrentTime($entity_id: uuid, $start: timestamptz , $to: timestamptz) {
    neo_skeleton_prod_exec(where: {entity_id: {_eq: $entity_id}, start_dt: {_gte: $start}, end_dt: {_is_null: true}}) {
      start_dt
      entity_id
      operator_id
      order_id
      end_dt
    }
  }`,
  getExecutionForSelectedTime:`
  query getExecutionForSelectedTime($entity_id: uuid, $start: timestamptz, $end: timestamptz) {
    neo_skeleton_prod_exec(where: {entity_id: {_eq: $entity_id}, start_dt: {_gte: $start}, end_dt: {_lte: $end}}) {
      start_dt
      entity_id
      operator_id
      order_id
      end_dt
    }
  }`,
  
  getAllInstrument:`
  query getAllInstrument {
    neo_skeleton_instruments {
      id
      name
    }
  }
  `,
  getInstMetOfAsset : 
  `query getInstMetOfAsset($instrument_id: String, $metric_id: bigint) {
    neo_skeleton_instruments_metrics(where: {instruments_id: {_eq: $instrument_id}, metrics_id: {_eq: $metric_id}}) {
      id
    }
  }`
  ,

  getAssertForOptix :
  `
  query MyQuery($instrument_type: Int, $line_id: uuid) {
    neo_skeleton_entity(where: {entity_instruments: {instrument: {instrument_type: {_eq: $instrument_type}, line_id: {_eq: $line_id}}}}) {
      id
      name
      entity_instruments {
        instrument_id
      }
      info
    }
  }
  
  `,
  getLatestSteelDataForAutoPopulate:
  `query MyQuery($entity_id: uuid) {
    neo_skeleton_steel_data(where: {entity_id: {_eq: $entity_id}}, order_by: {time: desc}, limit: 1) {
      entity_id
      key
      time
      value
    }
  }
  `,
  getInstrumentClass:
  `query getInstrumentClass {
    neo_skeleton_instrument_class {
      id
      class
    }
  }
  `,
  getReportType:`
  query getReportType {
    neo_skeleton_report_type {
      id
      name
    }
  }
  
  `,
  getProdOutageData:
  `query getProdOutageData($start_dt: timestamptz, $end_dt: timestamptz,$entity_id: uuid) {
    neo_skeleton_prod_outage(where: { start_dt: {_eq: $start_dt}, _and: {end_dt: {_eq: $end_dt}, _and: {entity_id: {_eq: $entity_id}}}}) {
      created_ts
      id
      order_id
      entity_id
      reason_id
      start_dt
      end_dt
      prod_reason {
        id
        reason
        prod_reason_type {
          id
          reason_type
        }
      }
    }
  }
  `,
  getCalenderDataSelectedTimeRange:`
  query getCalenderDataSelectedTimeRange($line_id: uuid, $start: timestamp, $end: timestamp, $name: order_by = asc) {
    neo_skeleton_calendar_report(order_by: {entity: {name: $name}}, where: {line_id: {_eq: $line_id}, upload_date: {_gte: $start, _lte: $end}}) {
      id
      created_by
      created_ts
      entity_id
      path_name
      report_type
      updated_by
      updated_ts
      upload_date
      entity {
        name
      }
    }
  }
  `,
  getSelectedAssetCalendarData:`
  query getSelectedAssetCalendarData($start: timestamp, $end: timestamp, $entity_id: uuid) {
    neo_skeleton_calendar_report(where: {upload_date: {_gte: $start, _lte: $end}, entity_id: {_eq: $entity_id}}) {
      id
      created_by
      created_ts
      entity_id
      path_name
      report_type
      updated_by
      updated_ts
      upload_date
      entity {
        name
      }
      user {
        name
      }
      userByUpdatedBy {
        name
      }
      reportTypeByReportType {
        name
      }
    }
  }
  
  `,

  alertDashboard:`query alertList($line_id: uuid) {
    neo_skeleton_alerts_v2(where: {line_id: {_eq: $line_id}}) {
      critical_max_value
      critical_min_value
      critical_type
      critical_value
      id
      instruments_metric {
        metric {
          id
          name
          title
        }
        instrument {
          id
          name
        }
      }
      insrument_metrics_id
      name
      warn_max_value
      warn_min_value
      warn_type
      warn_value
      viid
      entity_type
   
    }
  }`,
  getscadaviewListbyplant: `
  query getscadaviewListbyplant($line_id: uuid) {
  neo_skeleton_scada_dashboard(where: {line_id: {_eq: $line_id}}) {
    id
    standard
    line_id
    name
    updated_ts
    access_type
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

 `,
  getscadaviewList: `
query getscadaviewList($line_id: uuid, $user_id: uuid) {
  neo_skeleton_scada_dashboard {
    id
    standard
    line_id
    name
    updated_ts
    access_type
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
  neo_skeleton_user_default_scada_dashboard(where: {user_id: {_eq: $user_id}, _and: {line_id: {_eq: $line_id}}}) {
    line_id
    scada_dashboard {
      id
      name
      data
    }
  }
}

`,

GetmyScadaDetailsfornameupdate:`
query GetmyScadaDetailsfornameupdate($scada_id: uuid) {
  neo_skeleton_scada_dashboard(where: {id: {_eq: $scada_id}}) {
    id
    name
    line_id
    access_type
    scada_user_access_list
    updated_by
    created_by
  }
}`,

  smsAlertUsers:`
  query smsAlertUsers {
  neo_skeleton_alarm_sms_access {
    is_enable
    user_id
  }
}

  `,

  getAssetListForLine:`
  query getAssetListForLine($line_id: uuid) {
  neo_skeleton_entity(where: {line_id: {_eq: $line_id}, entity_type: {_eq: 3}}) {
    id
    name
  }
}

  `,
  getProductsListOnly :` 
  query getProductsListOnly($line_id: uuid) {
    neo_skeleton_prod_products(where: {line_id: {_eq: $line_id}}) {
      id
      product_id
      name
      expected_energy_unit
    }
   }
  
 `,

  getOfflineProducts:`
  query getOfflineProducts($line_id: uuid) {
    neo_skeleton_production_form(where: {line_id: {_eq: $line_id}}) {
      asset_id
      form_name
      product_id
      created_by
      frequency
      updated_ts
      id
      userByUpdatedBy {
        id
        name
      }
      entity {
        name
      }
      prod_product {
        name
        expected_energy_unit
        metric_unit {
          unit
          id
        }
        product_id
      }
    }
  }
  `,
  getProductExec:`
  query getProductExec($line_id: uuid, $id: uuid) {
    neo_skeleton_prod_exec(where: {form_id: {_eq: $id}, line_id: {_eq: $line_id}}) {
      id
      form_id
      updated_ts
      info
      end_dt
      start_dt
      userByUpdatedBy {
        id
        name
      }
   
    }
  }
  `,
  getProductDateWiseExec:`
  query getProductDateWiseExec($line_id: uuid, $id: uuid,$start: timestamptz, $end: timestamptz) {
    neo_skeleton_prod_exec(where: {form_id: {_eq: $id}, line_id: {_eq: $line_id}, info: {}, start_dt: {_gte: $start, _lte: $end}}) {
      id
      form_id
      updated_ts
      info
      end_dt
      start_dt
      userByUpdatedBy {
        id
        name
      }
    }
  }`,

  getAssetListOeeBasedOnly:`
  query getAssetListOeeBasedOnly($line_id: uuid) {
    neo_skeleton_entity(where: {entity_type: {_eq: 3}, line_id: {_eq: $line_id}, prod_asset_analytics_config: {}}, order_by: {name: asc, prod_asset_oee_config: {entity_id: asc}}) {
      id
      name
      analysis_types
      prod_asset_oee_config {
        entity_id
      }
    }
  }
  `,


  LicenseDetails:`
  query LicenseDetails {
  neo_skeleton_licensing_table {
    id
    line_id
    expiry_remainder
    expiry_date
  }
}
`,
getAttachmentList:`
query getAttachmentList($entity_id: uuid) {
  neo_skeleton_asset_attachment(where: {entity_id: {_eq: $entity_id}}) {
    entity_id
  }
}
`,
getStaredReport:`
query getStaredReport($line_id: uuid, $user_id: uuid) {
  neo_skeleton_reports_star_fav(where: {line_id: {_eq: $line_id}, user_id: {_eq: $user_id}}) {
    report_id
  }
}

`,
getDashboardListCustom:`
query getDashboardListCustom($line_id: uuid) {
  neo_skeleton_dashboard(where: {line_id: {_eq: $line_id}, custome_dashboard: {_eq: true}}) {
    name
    id
  }
}
`,
getscadaviewListdashboard: `
query getscadaviewListdashboard {
  neo_skeleton_scada_dashboard {
    id
    standard
    line_id
    name
    updated_ts
    access_type
    userByUpdatedBy
    {
      id
      name
      updated_ts
    }
    userByCreatedBy
    {
      id
      name
    }
  }
}

`,
getStarReport:`
query getStarReport($line_id: uuid, $user_id: uuid) {
  neo_skeleton_reports_star_fav(where: {line_id: {_eq: $line_id}, user_id: {_eq: $user_id}}) {
    report_id
  }
}

`,
CheckScadaName:`
query MyQuery {
  neo_skeleton_scada_dashboard {
    name
  }
}

`,
GetAssetListFetch:`
query GetAssetListFetch($entity_type: Int, $line_id: uuid ) {
  neo_skeleton_entity(where: {entity_type: {_eq: $entity_type}, line_id: {_eq: $line_id}}) {
    id
    name
    
  }
}

`,
Checkscadanamebyline:`
query Checkscadanamebyline($line_id: uuid, $name: String) {
  neo_skeleton_scada_dashboard(where: {name: {_eq: $name}, line_id: {_eq: $line_id}}) {
    name
  }
}`,

GetMetricbyInstrumentId:`
query GetMetricbyInstrumentId($intrument_id: String) {
  neo_skeleton_instruments_metrics(where: {instruments_id: {_eq: $intrument_id}}) {
    metric {
      id
      instrument_type
      metric_unit
      name
      title
      type
      metricUnitByMetricUnit {
        id
        description
        product_units
        unit
      }
      
    }
    instruments_id
    metrics_id
  }
}`,

Checkdashboardstared:`
query Checkdashboardstared($scada_id: uuid , $line_id: uuid ) {
  neo_skeleton_scada_dash_star_fav(where: {scada_id: {_eq: $scada_id}, line_id: {_eq: $line_id}}) {
    user_id
    scada_id
    line_id
  }
}`,
GetScadadashbordbylineid:`
query GetScadadashbordbylineid($jsonFilter: jsonb, $line_id: uuid) {
  neo_skeleton_scada_dashboard(where: {scada_user_access_list: {_contains: $jsonFilter}, line_id: {_eq: $line_id}}) {
    scada_user_access_list
    name
    line_id
    id
    standard
    updated_ts
    line {
      id
      name
    }
    access_type
    created_by
    created_ts
    data
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
`,
GetScadadashbordbylineidincluidingpublic:`
query GetScadadashbordbylineidincluidingpublic($jsonFilter: jsonb, $line_id: uuid) {
  neo_skeleton_scada_dashboard(
    where: {
      _or: [
        { scada_user_access_list: { _contains: $jsonFilter }, line_id: { _eq: $line_id } },
        { access_type: { _eq: 1 }, line_id: { _eq: $line_id } }
      ]
    }
  ) {
    scada_user_access_list
    name
    line_id
    id
    standard
    updated_ts
    line {
      id
      name
    }
    access_type
    created_by
    created_ts
    data
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
`,

getStarDashboard:`
query getStarDashboard($line_id: uuid, $user_id: uuid) {
  neo_skeleton_dashboard_star_fav(where: {line_id: {_eq: $line_id}, user_id: {_eq: $user_id}}) {
    dashboard_id
  }
}
`,
ToolLife:`
query ToolLife($line_id: uuid) {
  neo_skeleton_tool_life(where: {line_id: {_eq: $line_id}}) {
    asset_types
    id
    intruments
    limit
    line_id
    name
    updated_by
    updated_ts
    userByCreatedBy {
      name
    }
    asset_type {
      name
      id
    }
    created_ts
    reset_ts
    limit_ts
     }
}
`,
Co2Factor:`
query Co2Factor($line_id: uuid) {
  neo_skeleton_co2_factor(where: {line_id: {_eq: $line_id}}) {
    co2_value
    default_value
    ends_at
    id
    starts_at
    updated_by
  }
} 
`,
getForeCastModelBuildStatus:`
query getForeCastModelBuildStatus($line_id: uuid) {
  neo_skeleton_instruments_metrics_forecasting(where: {instruments_metric: {instrument: {line_id: {_eq: $line_id}}}}) {
    ins_met_is
    instruments_metric {
      instrument {
        id
        line_id
        name
      }
      metric {
        id
        name
        title
      }
    }
    status
    created_ts
  }
}
`,
ScadaselectedValue:`
query ScadaselectedValue( $scada_id: uuid) {
  neo_skeleton_scada_dashboard(where: {id: {_eq: $scada_id}}) {
    id
    access_type
    created_by
    created_ts
    data
    line_id
    name
    scada_user_access_list
    updated_by

  }
}
`,
SelectedsavedScadafav:`
query SelectedsavedScadafav($user_id: uuid, $scada_id: uuid, $line_id: uuid ) {
  neo_skeleton_scada_dash_star_fav(where: {user_id: {_eq: $user_id}, scada_id: {_eq: $scada_id}, line_id: {_eq: $line_id}}) {
    line_id
    scada_id
    id
    user_id
  }
} 
`,
getscada_image:`
query getscada_image($line_id: uuid ) {
  neo_skeleton_scada_attachment(where: {line_id: {_eq: $line_id}}) {
    line_id
    image_name
    id
  }
}
`,
getModelAccessList:`
query getModelAccessList($line_id: uuid) {
  neo_skeleton_module_access(where: {line_id: {_eq: $line_id}}) {
    access_id
    is_visible
    line_id
    module_id
   
  }
}

`,
Selectallfavdashboard:`
query Selectallfavdashboard($user_id: uuid, $line_id: uuid ) {
  neo_skeleton_scada_dash_star_fav(where: {user_id: {_eq: $user_id}, line_id: {_eq: $line_id}}) {
    line_id
    scada_id
    id
    user_id
  }
}
`,
getSubModelAccessList:`
query getSubModelAccessList($line_id: uuid)  {
  neo_skeleton_sub_module_access(where: {line_id: {_eq: $line_id}, is_visible: {_eq: true}}) {
    access_id
    is_visible
    line_id
    sub_module_id
    module {
      is_default
      module_id
      module_name
      short_text
      sub_modules {
        sub_module_name
        sub_module_id
        module_id
      }
    }
  }
}
`,
getOffline_Alerts:`
query getOffline_Alerts($line_id: uuid,$iid: String) {
  neo_skeleton_alerts_offline(where: {line_id: {_eq: $line_id}, iid: {_eq: $iid}}) {
    created_at
    created_by
    escalation_times
    escalation_users
    frequency_count
    frequency_seconds
    iid
  }
}
`,
getPlantAssets:`
query getPlantAssets($line_id: uuid) {
  neo_skeleton_line_logo(where: {line_id: {_eq: $line_id}}) {
    dark_logo
    light_logo
    dark_favicon
    light_favicon
    line_id
  }
}
`
}


export default Queries;

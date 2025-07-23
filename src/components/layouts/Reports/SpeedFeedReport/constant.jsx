

export const headCells = [
    {
        id: 'Serial No.',
        numeric: false,
        disablePadding: true,
        label: 'S No',
    },
    {
        id: 'Asset Name',
        numeric: false,
        disablePadding: true,
        label: 'Asset Name',
    },
    {
        id: 'Date',
        numeric: false,
        disablePadding: false,
        label: 'Date',
    },
    {
        id: 'Shift',
        numeric: false,
        disablePadding: false,
        label: 'Shift',

    },
    {
        id: 'spindle_speed',
        numeric: false,
        disablePadding: false,
        label: 'Spindle Speed',
    },
    {
        id: 'spindle_status',
        numeric: false,
        disablePadding: false,
        label: 'Spindle Status',
    },
    {
        id: 'feed_rate',
        numeric: false,
        disablePadding: false,
        label: 'Feed Rate',
    },
    {
        id: 'feed_status',
        numeric: false,
        disablePadding: false,
        label: 'Feed Status',
    },
    {
        id: 'Start Time',
        numeric: false,
        disablePadding: false,
        label: 'Start Time',
    },
    {
        id: 'End Time',
        numeric: false,
        disablePadding: false,
        label: 'End Time',
    },
    {
        id: 'Duration',
        numeric: false,
        disablePadding: false,
        label: 'Duration',
    },
];

export const getDurationInMinutes = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const durationMs = end - start; // Difference in milliseconds
  
    // Convert milliseconds to hours, minutes, and seconds
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    const milliseconds = durationMs % 1000;
    
    // Ensure two-digit format (e.g., "01:05:09" instead of "1:5:9")
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

export const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= new Date(endDate)) {
      dates.push(currentDate.toISOString().split("T")[0]); // Format as YYYY-MM-DD
      currentDate.setDate(currentDate.getDate() + 1); // Increment by 1 day
    }
  
    return dates;
}


// const getSpindleRawData = (data) => {
  //   let between_dates = getDatesBetween(
  //     moment(new Date(Customdatesval.StartDate)).format("YYYY-MM-DD"),
  //     moment(new Date(Customdatesval.EndDate)).format("YYYY-MM-DD")
  //   );

  //   let sorted_data = data.sort((a, b) => new Date(a.start) - new Date(b.start));

  //   console.clear()
  //   console.log(sorted_data)
  //   let start_time = moment(Customdatesval.startDate).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ")
  //   let end_time = moment(Customdatesval.EndDate).set('date', moment(Customdatesval.EndDate).get('date')).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ")
  //   console.log("end_time __", end_time)
  //   // sorted_data[0].start
  //   let temp_arr = []

  //   sorted_data.map((z, index) => {
  //     if(index === 0){
  //       if(new Date(z.start).getTime() > new Date(start_time).getTime()){
  //         temp_arr.push({
  //           x: `${moment(start_time).format('YYYY-MM-DD')}`,
  //           y: [moment(new Date(start_time).toLocaleString()).valueOf(), moment(new Date( z.start).toLocaleString()).valueOf()],
            
  //           SspeedOvr: 'Unknown',
  //           start: start_time,
  //           end: z.start,
  //           date: `${moment(start_time).format('YYYY-MM-DD')}`
  //         })
  //       }
  //     } else if(index === sorted_data.length-1 ){
  //       if(new Date(z.end).getTime()<new Date(end_time).getTime()){
  //         temp_arr.push({
  //           x: `${moment(z.end).format('YYYY-MM-DD')}`,
  //           y: [moment(new Date(z.end).toLocaleString()).valueOf(), moment(new Date(end_time).toLocaleString()).valueOf()],
            
  //           SspeedOvr: 'Unknown',
  //           start: z.end,
  //           end: end_time,
  //           // time: z.end
  //           date: `${moment(z.end).format('YYYY-MM-DD')}`
  //         })
  //       }
  //     } else {
  //       temp_arr.push({
  //         x: `${moment(z.start).format('YYYY-MM-DD')}`,
  //         y: [moment(new Date(z.start).toLocaleString()).valueOf(), moment(new Date(z.end).toLocaleString()).valueOf()],
          
  //         SspeedOvr: z.SspeedOvr,
  //         start: z.start,
  //         end: z.end,
  //         date: `${moment(z.start).format('YYYY-MM-DD')}`
  //       })
  //     }
  //     // return null
  //   })
  //   console.log("TEMP_ARR ______\n",temp_arr, between_dates)
    
  //   let Statusdata = {}
  //   let total_count = 0
  //   between_dates.map((date, zindex) => {
  //     let Normal_arr = []
  //     let Deviation_arr = []
  //     let Unknown_arr = []
  //     let avail_data = temp_arr.filter((temp) => temp.date === date)

  //     console.log("avail_data __",avail_data)
  //     if(avail_data.length > 0){
  //       avail_data.map((arr) => {
        
  //         if(arr.date === date){
  //           total_count = total_count +1
  //           if(arr.SspeedOvr === 'Normal'){
  //             Normal_arr.push(arr)
  //           } else if(arr.SspeedOvr === 'Unknown') {
  //             Unknown_arr.push(arr)
  //           } else {
  //             Deviation_arr.push(arr)
  //           }
  //         }
  //       })
  //     }
  //     else {
  //       let time =  zindex === between_dates.length-1 
  //                   ? moment(moment(Customdatesval.EndDate).set('date', moment(Customdatesval.EndDate).get('date')).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute'))).valueOf() 
  //                   : moment(moment(date).set('hours', 23).set('minutes', 59).set('second', 59)).valueOf() 
  //       Unknown_arr.push({
  //         x: `${moment(date).format('YYYY-MM-DD')}`,
  //         y: [moment(new Date(date).toLocaleString()).valueOf(), time],
          
  //         SspeedOvr: 'Unknown',
  //         start: moment(date).startOf('day').format("YYYY-MM-DDTHH:mm:ssZ"),
  //         end: zindex === between_dates.length-1 ?  moment(Customdatesval.EndDate).set('date', moment(Customdatesval.EndDate).get('date')).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).set('hours', 23).set('minutes', 59).set('second', 59).format("YYYY-MM-DDTHH:mm:ssZ"),
  //         date: `${moment(date).format('YYYY-MM-DD')}`
  //       })
  //     }
      

  //     Statusdata[date] = [{
  //           name: 'Deviation',
  //           data: Deviation_arr,
  //           start_of_day: moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ"), 
  //            end_of_day: moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ"),
  //       },
  //       {
  //         name: 'Normal',
  //         data: Normal_arr,
  //         start_of_day: moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ"), 
  //          end_of_day: moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ"),
  //       },
  //       {
  //         name: 'Unknown',
  //         data: Unknown_arr,
  //         start_of_day: moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ"), 
  //          end_of_day: moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ"),
  //       }
  //     ]
  //   })

  //   console.log("STATUS DATA________\n", Statusdata)
  //   setSpeedData(Statusdata)

    
  // }

  // const getFeedRawData = (data) => {
  //   let between_dates = getDatesBetween(
  //     moment(new Date(Customdatesval.StartDate)).format("YYYY-MM-DD"),
  //     moment(new Date(Customdatesval.EndDate)).format("YYYY-MM-DD")
  //   );

  //   let sorted_data = data.sort((a, b) => new Date(a.start) - new Date(b.start));

  //   console.clear()
  //   console.log(sorted_data)
  //   let start_time = moment(Customdatesval.startDate).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ")
  //   let end_time = moment(Customdatesval.EndDate).set('date', moment(Customdatesval.EndDate).get('date')).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ")
  //   console.log("end_time __", end_time)
  //   // sorted_data[0].start
  //   let temp_arr = []

  //   sorted_data.map((z, index) => {
  //     if(index === 0){
  //       if(new Date(z.start).getTime() > new Date(start_time).getTime()){
  //         temp_arr.push({
  //           x: `${moment(start_time).format('YYYY-MM-DD')}`,
  //           y: [moment(new Date(start_time).toLocaleString()).valueOf(), moment(new Date( z.start).toLocaleString()).valueOf()],
            
  //           Fovr: 'Unknown',
  //           start: start_time,
  //           end: z.start,
  //           date: `${moment(start_time).format('YYYY-MM-DD')}`
  //         })
  //       }
  //     } else if(index === sorted_data.length-1 ){
  //       if(new Date(z.end).getTime()<new Date(end_time).getTime()){
  //         temp_arr.push({
  //           x: `${moment(z.end).format('YYYY-MM-DD')}`,
  //           y: [moment(new Date(z.end).toLocaleString()).valueOf(), moment(new Date(end_time).toLocaleString()).valueOf()],
            
  //           Fovr: 'Unknown',
  //           start: z.end,
  //           end: end_time,
  //           // time: z.end
  //           date: `${moment(z.end).format('YYYY-MM-DD')}`
  //         })
  //       }
  //     } else {
  //       if(index+1 < sorted_data.length ) {
  //         if (new Date(sorted_data[index + 1].start).getTime() !== new Date(z.end).getTime()) {
  //           temp_arr.push({
  //             x: `${moment(z.start).format('YYYY-MM-DD')}`,
  //             y: [moment(new Date(z.end).toLocaleString()).valueOf(), moment(new Date(sorted_data[index + 1].start).toLocaleString()).valueOf()],
              
  //             Fovr: 'Unknown',
  //             start: z.end,
  //             end: sorted_data[index + 1].start,
  //             date: `${moment(z.start).format('YYYY-MM-DD')}`
  //           })
  //         } else {
  //           temp_arr.push({
  //             x: `${moment(z.start).format('YYYY-MM-DD')}`,
  //             y: [moment(new Date(z.start).toLocaleString()).valueOf(), moment(new Date(z.end).toLocaleString()).valueOf()],
              
  //             Fovr: z.Fovr,
  //             start: z.start,
  //             end: z.end,
  //             date: `${moment(z.start).format('YYYY-MM-DD')}`
  //           })
  //         }
         
  //       }
        
        
  //     }
  //     // return null
  //   })
  //   console.log("TEMP_ARR ______\n",temp_arr, between_dates)
    
  //   let Statusdata = {}
  //   let total_count = 0
  //   between_dates.map((date, zindex) => {
  //     let Normal_arr = []
  //     let Deviation_arr = []
  //     let Unknown_arr = []
  //     let avail_data = temp_arr.filter((temp) => temp.date === date)

  //     console.log("avail_data __",avail_data)
  //     if(avail_data.length > 0){
  //       avail_data.map((arr) => {
        
  //         if(arr.date === date){
  //           total_count = total_count +1
  //           if(arr.Fovr === 'Normal'){
  //             Normal_arr.push(arr)
  //           } else if(arr.Fovr === 'Unknown') {
  //             Unknown_arr.push(arr)
  //           } else {
  //             Deviation_arr.push(arr)
  //           }
  //         }
  //       })
  //     }
  //     else {
  //       let time =  zindex === between_dates.length-1 
  //                   ? moment(moment(Customdatesval.EndDate).set('date', moment(Customdatesval.EndDate).get('date')).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute'))).valueOf() 
  //                   : moment(moment(date).set('hours', 23).set('minutes', 59).set('second', 59)).valueOf() 
  //       Unknown_arr.push({
  //         x: `${moment(date).format('YYYY-MM-DD')}`,
  //         y: [moment(new Date(date).toLocaleString()).valueOf(), time],
          
  //         Fovr: 'Unknown',
  //         start: moment(date).startOf('day').format("YYYY-MM-DDTHH:mm:ssZ"),
  //         end: zindex === between_dates.length-1 ?  moment(Customdatesval.EndDate).set('date', moment(Customdatesval.EndDate).get('date')).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ") : moment(date).set('hours', 23).set('minutes', 59).set('second', 59).format("YYYY-MM-DDTHH:mm:ssZ"),
  //         date: `${moment(date).format('YYYY-MM-DD')}`
  //       })
  //     }
      

  //     Statusdata[date] = [{
  //           name: 'Deviation',
  //           data: Deviation_arr,
  //           start_of_day: moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ"), 
  //            end_of_day: moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ"),
  //       },
  //       {
  //         name: 'Normal',
  //         data: Normal_arr,
  //         start_of_day: moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ"), 
  //          end_of_day: moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ"),
  //       },
  //       {
  //         name: 'Unknown',
  //         data: Unknown_arr,
  //         start_of_day: moment(date).set('hours', moment(Customdatesval.StartDate).get('hour')).set('minutes', moment(Customdatesval.StartDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ"), 
  //          end_of_day: moment(date).set('hours', moment(Customdatesval.EndDate).get('hour')).set('minutes', moment(Customdatesval.EndDate).get('minute')).format("YYYY-MM-DDTHH:mm:ssZ"),
  //       }
  //     ]
  //   })

  //   console.log("STATUS DATA________\n", Statusdata)
  //   setFeedData(Statusdata)

    
  // }
  
  
var getXY = function (event_lngX,event_latY){
    var mapLocation = event_lngX+","+event_latY;
    alert(mapLocation);
};

loadMap({
            mapid:"myDiv",
            mapHeight:"180",
            mapwidth:"360",
            mapMarginRight:"22",
            mapMarginLeft:"18",
            autoCompleteHeight:"25",
            locationSearch:true,
            mapParam:{
                center: [114.305215,30.592935],
                mapStyle:"amap://styles/" + "514e1515b571fbf953987460c65b064d",
                resizeEnable: true,
                rotateEnable:true,
                pitchEnable:true,
                zoom:20,
                pitch:80,
                rotation:-15,
                viewMode:'3D'
            }
        },getXY);

loadMap({
            mapid:"myDiv2",
            mapHeight:"180",
            mapwidth:"360",
            mapMarginRight:"22",
            mapMarginLeft:"18",
            autoCompleteHeight:"25",
            locationSearch:true,
            mapParam:{
                center: [114.305215,30.592935],
                mapStyle:"amap://styles/" + "aaab6c214061407435ed23a92dff1b6a",
                resizeEnable: true,
                rotateEnable:true,
                pitchEnable:true,
                zoom:20,
                pitch:80,
                rotation:-15,
                viewMode:'3D'
            }
        },getXY);
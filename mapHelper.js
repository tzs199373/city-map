/**
 * author tzs
 * version 1.0
 * since 2020/2/28 10:55
 */
/**
 * 提供loadMap(param,fn)函数
 * fn：获取经纬度回调
 * param={
    "mapid":"myDiv",
    "mapHeight":"180",
    "mapwidth":"360",
    "mapMarginRight":"25",
    "mapMarginLeft":"15",
    "autoCompleteHeight":"25",
}
 mapid：外部容器ID
 mapHeight：地图高
 mapwidth：地图宽
 mapMarginTop：
 mapMarginBottom：
 mapMarginRight：
 mapMarginLeft：
 autoCompleteHeight：搜索地点提示框高度
 locationSearch:是否需要地点搜索
 mapParam高德地图初始化参数
 */
var cacheMap = {};

function loadMap(param,fn) {
    if(!param.mapid){throw new Error("mapid is null")}
    if(cacheMap[param.mapid] == null) {
        cacheMap[param.mapid] = {
            map: null,
            marker: null,
            auto: null,
            placeSearch: null,
            gModelMesh:[],
            gModelCnt:0,
            gObject3Dlayer: null
        };
        loadCSS();
        loadDocument(param);
        loadStyle(param);
        initMap(cacheMap[param.mapid], param, fn);
    }else{
        flushMap(cacheMap[param.mapid],param);
        if(param.mapParam.center != null){
            cacheMap[param.mapid].map.setCenter(param.mapParam.center);
            addCenterMaker(cacheMap[param.mapid],param.mapParam.center)
        }
    }
}

function loadCSS () {
    var style = document.createElement("style");
    style.type = "text/css";
    try{
        style.appendChild(document.createTextNode(".mapLocationSearchDiv{position:relative;z-index:1000;}" +
            ".mapLocationSearchBtn{width:30px;height:24px;background-image:url('search.png');background-size:16px 16px;background-position:7px 4px;background-repeat:no-repeat;position:absolute;top:0;cursor:pointer;}" +
            ".amap-sug-result{z-index:1200;}" +
            ".amap-logo{display:none;}" +
            ".amap-copyright{opacity:0;}"));
    }catch(ex){
        style.styleSheet.cssText = ".mapLocationSearchDiv{position:relative;z-index:1000;}" +
            ".mapLocationSearchBtn{width:30px;height:24px;background-image:url('search.png');background-size:16px 16px;background-position:7px 4px;background-repeat:no-repeat;position:absolute;top:0;cursor:pointer;}" +
            ".amap-sug-result{z-index:1200;}" +
            ".amap-logo{display:none;}" +
            ".amap-copyright{opacity:0;}";//针对IE
    }
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
}
function loadDocument(param) {
    var content =
        "<div id='"+param.mapid+"_mapWrapper' class='mapWrapper'>" +
        "<div id='"+param.mapid+"_mapScreen' class='mapScreen'></div>" +
        "<div id='"+param.mapid+"_mapLocationSearchDiv' class='mapLocationSearchDiv'>" +
        "<input type='text' id='"+param.mapid+"_mapLocationSearchInput' class='mapLocationSearchInput'  autocomplete='off' placeholder='地图地点搜索'/>" +
        "<span id='"+param.mapid+"_mapLocationSearchBtn' class='mapLocationSearchBtn'></span>" +
        "</div>" +
        "</div>";
    $("#"+param.mapid).html(content);
}
function loadStyle(param) {
    $("#"+param.mapid+"_mapWrapper").css({"height":param.mapHeight,
        "width":param.mapwidth,
        "margin-top":param.mapMarginTop,
        "margin-bottom":param.mapMarginBottom,
        "margin-left":param.mapMarginLeft,
        "margin-right":param.mapMarginRight
    });
    $("#"+param.mapid+"_mapScreen").css({"height":param.mapHeight,
        "width":param.mapwidth
    });
    $("#"+param.mapid+"_mapLocationSearchDiv").css({"width":param.autoCompleteHeight,
        "bottom":param.autoCompleteHeight
    });
    $("#"+param.mapid+"_mapLocationSearchInput").css({"width":param.mapwidth});
    $("#"+param.mapid+"_mapLocationSearchBtn").css({"left":param.mapwidth-30});

    if(!param.locationSearch){
        $("#"+param.mapid+"_mapLocationSearchDiv").css({"display":"none"});
        $("#"+param.mapid+"_mapLocationSearchInput").css({"display":"none"});
        $("#"+param.mapid+"_mapLocationSearchBtn").css({"display":"none"});
    }
}

function initMap(cacheInfo,param,fn){
    cacheInfo.map = new AMap.Map(param.mapid+'_mapScreen',param.mapParam);
    cacheInfo.map.on("click", function (e) {
        if (cacheInfo.marker != null) {
            cacheInfo.map.remove(cacheInfo.marker);
        }
        fn(e.lnglat.lng,e.lnglat.lat)
    });
    loadModelFunc(cacheInfo);
    addAuto(cacheInfo,param);
    addCenterMaker(cacheInfo,param.mapParam.center);
}

function addAuto(cacheInfo,param) {
    if(param.locationSearch){
        cacheInfo.auto = new AMap.Autocomplete({
            input: param.mapid+"_mapLocationSearchInput"
        });

        AMap.service(["AMap.PlaceSearch"], function() {
            cacheInfo.placeSearch = new AMap.PlaceSearch({
                pageSize: 8, // 单页显示结果条数
                pageIndex: 1, // 页码
                city: "", // 兴趣点城市
                map: cacheInfo.map, // 展现结果的地图实例
            });
        });
        //添加marker信息点击事件
        AMap.event.addListener(cacheInfo.placeSearch, "markerClick", function(e) {});

        $("#"+param.mapid).on("click","#"+param.mapid+"_mapLocationSearchBtn",function(e){
            cacheInfo.placeSearch .search($("#"+param.mapid+"_mapLocationSearchInput").val());
        });
    }
}

function addCenterMaker(cacheInfo,centerPoint) {
    if(centerPoint != null){
        cacheInfo.marker = new AMap.Marker({
            position: centerPoint
        });
        cacheInfo.map.add(cacheInfo.marker);
    }
}


function flushMap(cacheInfo,param){
    cacheInfo.map.clearMap();//清除所有覆盖物
    if($("#"+param.mapid+"_mapLocationSearchInput").length != 0){
        $("#"+param.mapid+"_mapLocationSearchInput").val("");
    }
    $(".amap-sug-result").html("");
    $(".amap-sug-result").css("visibility","hidden");
    $(".amap-sug-result").css("display","none");
}

function loadModelFunc(cacheInfo) {
    cacheInfo.map.AmbientLight = new AMap.Lights.AmbientLight([0,1,1],1);
    cacheInfo.map.DirectionLight = new AMap.Lights.DirectionLight([1,0,-0.5],[1,1,1],1);
    var modelName = 'building';
    var objLoader = new THREE.OBJLoader2();
    var callbackOnLoad = function (event) {
        cacheInfo.gObject3Dlayer = new AMap.Object3DLayer();
        var meshes = event.detail.loaderRootNode.children;
        for(var i=0;i<meshes.length;i++){
            var vecticesF3 = meshes[i].geometry.attributes.position;
            var vecticesNormal3 = meshes[i].geometry.attributes.normal;
            var vecticesUV2 = meshes[i].geometry.attributes.uv;
            var vectexCount =  vecticesF3.count;
            var mesh = new AMap.Object3D.MeshAcceptLights();
            cacheInfo.gModelMesh.push({
                vecticesF3: vecticesF3,
                vecticesNormal3: vecticesNormal3,
                vecticesUV2: vecticesUV2,
                vectexCount: vectexCount,
                mesh: mesh,
                material: meshes[i].material[0]||meshes[i].material
            });
            cacheInfo.gModelCnt++;
        }
        // window.requestAnimationFrame(modelRender);
    };
    var onLoadMtl = function ( materials ) {
        objLoader.setModelName(modelName);
        objLoader.setMaterials(materials);
        objLoader.load('/IntellComSys/pub/model/hbgz.obj', callbackOnLoad, null, null, null, false);
    };
    objLoader.loadMtl( '/IntellComSys/pub/model/hbgz.mtl', null, onLoadMtl);
}


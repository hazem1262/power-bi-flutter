var anchorFeatures = new ol.Collection();
var anchorIdProperty = 'anchor_id';
var createString = 'create';
var selectString = 'select';
var translateString = 'translate';
var translateStartString = 'translatestart';
var translateEndString = 'translateend';
var singleClickString = 'singleclick';
var nullString = 'N/A';
var defaultAnchorStyle;
var selectedAnchorStyle;
var vectorAnchorSource;
var vectorAnchorLayer;
var select;
var selectKey;
var translate;
var translateEndKey;
var translateStartKey;
var singleclick_key;

function approveAnchor(anchorId, anchorWntInventoryId, latitude, longitude){
    let point = new ol.geom.Point(transformation.transform([longitude,latitude]));
    let anchorFeature = new ol.Feature({
        geometry: point
    });
    anchorFeature.set(anchorIdProperty, anchorWntInventoryId);
    anchorFeature.setId(anchorId);
    anchorFeatures.push(anchorFeature);
}

function unapproveAnchor(anchorId){
    let anchorFeature = vectorAnchorSource.getFeatureById(anchorId);
    vectorAnchorSource.removeFeature(anchorFeature);
}

function drawApprovedAnchors(floorAnchors){
    for(const floorAnchor of floorAnchors){
        let floorAnchorCoordinates = floorAnchor.coordinates.coordinates;
        approveAnchor(floorAnchor.id, floorAnchor.wnt_inventory_id, floorAnchorCoordinates[1], floorAnchorCoordinates[0]);
    }
}

function getAnchorStyle(feature) {
    defaultAnchorStyle.getText().setText(feature.get(anchorIdProperty).toString());
    return defaultAnchorStyle;
}

function getSelectedAnchorStyle(feature) {
    selectedAnchorStyle.getText().setText(feature.get(anchorIdProperty).toString());
    return selectedAnchorStyle;
}

function initAnchorStyle(blueprintAnchorIconPath){
    defaultAnchorStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: blueprintAnchorIconPath
        }),
        text: new ol.style.Text({
            offsetY: 15,
            scale: 1.2,
            fill: new ol.style.Fill({
                color: "#000000"
            }),
            stroke: new ol.style.Stroke({
                color: "#ffffff",
                width: 2
            })
        })
    });
}

function initSelectedAnchorStyle(blueprintSelectedAnchorIconPath){
    selectedAnchorStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: blueprintSelectedAnchorIconPath
        }),
        text: new ol.style.Text({
            offsetY: 15,
            scale: 1.2,
            fill: new ol.style.Fill({
                color: "#ffffff"
            }),
            stroke: new ol.style.Stroke({
                color: "#000000",
                width: 2
            })
        })
    });
}

function initSelectInteraction(){
    select = new ol.interaction.Select({
        layers: [vectorAnchorLayer],
        style: getSelectedAnchorStyle,
        hitTolerance: 5
    });
    selectKey = select.on(selectString, function(evt){
        if (SelectChannel !== undefined) {
            if(evt.selected.length > 0){
                SelectChannel.postMessage(evt.selected[0].getId());
            } else {
                SelectChannel.postMessage(nullString);
            }
        } else if(DebugChannel !== undefined){
            DebugChannel.postMessage("Select channel undefined");
        }
    });
}

function addSelectInteraction(){
    map.addInteraction(select);
    if(InteractChannel !== undefined) {
        InteractChannel.postMessage(selectString);
    } else if(DebugChannel !== undefined){
        DebugChannel.postMessage("Interact channel undefined");
    }
}

function initTranslateInteraction(){
    translate = new ol.interaction.Translate({
        features: select.getFeatures(),
        hitTolerance: 5
    });
    translateStartKey = translate.on(translateStartString, evt => {
        if (TranslateChannel !== undefined) {
            TranslateChannel.postMessage('');
        } else if(DebugChannel !== undefined){
            DebugChannel.postMessage("Translate channel undefined");
        }
    });
    translateEndKey = translate.on(translateEndString, evt => {
        if (TranslateChannel !== undefined) {
            let translatedCoordinates = transformation.reverse(evt.features.item(0).getGeometry().getCoordinates());
            TranslateChannel.postMessage(evt.features.item(0).getId() + ',' + translatedCoordinates[1]+ ',' + translatedCoordinates[0]);
        } else if(DebugChannel !== undefined){
            DebugChannel.postMessage("Translate channel undefined");
        }
    });
}

function addTranslateInteraction(){
    map.addInteraction(translate);
    if(InteractChannel !== undefined) {
        InteractChannel.postMessage(translateString);
    } else if(DebugChannel !== undefined){
        DebugChannel.postMessage("Interact channel undefined");
    }
}

function addCreateInteraction(){
    singleclick_key = map.on(singleClickString, function(evt){
        let translatedCoordinates = transformation.reverse(evt.coordinate);
        CreateChannel.postMessage(translatedCoordinates[1]+ ',' + translatedCoordinates[0]);
    });
    if(InteractChannel !== undefined) {
        InteractChannel.postMessage(createString);
    } else if(DebugChannel !== undefined){
        DebugChannel.postMessage("Interact channel undefined");
    }
}

function resetSelectInteractions(){
    select.getFeatures().clear();
    map.removeInteraction(select);
    map.removeInteraction(translate);
    if(InteractChannel !== undefined) {
        InteractChannel.postMessage('');
    } else if(DebugChannel !== undefined){
        DebugChannel.postMessage("Interact channel undefined");
    }
}

function resetCreateInteraction(){
    ol.Observable.unByKey(singleclick_key);
    if(InteractChannel !== undefined) {
        InteractChannel.postMessage('');
    } else if(DebugChannel !== undefined){
        DebugChannel.postMessage("Interact channel undefined");
    }
}

function resetAnchorPosition(anchorId, latitude, longitude){
    let anchorFeature = vectorAnchorSource.getFeatureById(anchorId);
    anchorFeature.getGeometry().setCoordinates(transformation.transform([longitude,latitude]));
}

/**
POC functions
*/
//Analysis
var vectorAnalysisSource;
var vectorAnalysisLayer;
var animating = false;
var speed = 1;
var startTime, pauseTime, pauseStartTime, seekTime;
var analysisFeatures = new ol.Collection();
var geoMarker, routeFeature, invisibleRouteFeature;
var dx, dy;
var startMarker;
var endMarker;
var routeCoords;
var routeTimestamps;
var routeLength;
var previousIndex;
var ended = true;

//Heatmap
var vectorHeatmapSource;
var vectorHeatmapLayer;
var heatmapFeatures = new ol.Collection();
var heatmapFeaturesList;

function initWorkerHistory(workerHistoryList) {
    let transformedFeaturePositionList = workerHistoryList.map(workerHistory => {
           return transformation.transform([workerHistory.longitude, workerHistory.latitude]);
   });
    let route = new ol.geom.LineString(transformedFeaturePositionList);
    routeCoords = route.getCoordinates();
    routeTimestamps = workerHistoryList.map(workerHistory => {
            return Date.parse(workerHistory.generated_at) - Date.parse(workerHistoryList[0].generated_at);
    });

    routeLength = routeCoords.length;

    invisibleRouteFeature = new ol.Feature({
     type: 'invisibleRoute',
      geometry: route
    });

    routeFeature = new ol.Feature({
      type: 'route',
      geometry: new ol.geom.LineString([routeCoords[0]])
    });

    geoMarker = new ol.Feature({
      type: 'geoMarker',
      geometry: new ol.geom.Point(routeCoords[0])
    });
    startMarker = new ol.Feature({
      type: 'icon',
      geometry: new ol.geom.Point(routeCoords[0])
    });
    endMarker = new ol.Feature({
      type: 'icon',
      geometry: new ol.geom.Point(routeCoords[routeLength - 1])
    });

    analysisFeatures.clear();
    analysisFeatures.push(invisibleRouteFeature);
    analysisFeatures.push(routeFeature);
//    analysisFeatures.push(startMarker);
//    analysisFeatures.push(endMarker);
    analysisFeatures.push(geoMarker);
    stopAnimation(0, false, false, false);
    setSpaghettiSpeed(1, 0, false);
}

function initHeatmap(workerHistoryList) {
    heatmapFeatures.clear();
    heatmapFeaturesList = [];
    routeCoords = [];
    routeTimestamps = [];
    for (var i = 0; i < workerHistoryList.length; i++) {
      routeCoords[i] = transformation.transform([workerHistoryList[i].longitude, workerHistoryList[i].latitude]);
      routeTimestamps[i] = Date.parse(workerHistoryList[i].generated_at) - Date.parse(workerHistoryList[0].generated_at);
      heatmapFeaturesList[i] = new ol.Feature({geometry: new ol.geom.Point(routeCoords[i])});
      heatmapFeaturesList[i].set('duration', workerHistoryList[i].durationMS);
      heatmapFeaturesList[i].set('weight', heatmapFeaturesList[i].get('duration')/600);
      heatmapFeatures.push(heatmapFeaturesList[i]);
    }
    stopAnimation(1, false, false, false);
    setHeatmapSpeed(1, 0, routeTimestamps[routeTimestamps.length-1], false);
}

var analysisStyles = {
  'invisibleRoute': new ol.style.Style({
    stroke: new ol.style.Stroke({
      width: 6, color: [237, 212, 0, 0]
    })
  }),
  'route': new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 6, color: [237, 212, 0, 1]
      })
    }),
  'icon': new ol.style.Style({
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
          color: "#000000"
      }),
      stroke: new ol.style.Stroke({
          color: "#ffffff",
          width: 2
      })
    })
  }),
  'geoMarker': new ol.style.Style({
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
          color: "#ffffff"
      }),
      stroke: new ol.style.Stroke({
          color: "#000000",
          width: 2
      })
    })
  })
};

var animateSpaghettiMapFeature = function(event) {
  var vectorContext = ol.render.getVectorContext(event);
  var frameState = event.frameState;

  if (animating) {
    var elapsedTime = frameState.time - startTime - pauseTime;
    // here the trick to increase speed is to jump some indexes
    // on lineString coordinates
    let index = previousIndex;
    if(seekTime + speed * elapsedTime - routeTimestamps[previousIndex+1] >= 0) {
        while(index < routeCoords.length-1 && seekTime + speed * elapsedTime - routeTimestamps[previousIndex+1] >= 0) {
            index ++;
            let geometry = routeFeature.getGeometry();
            geometry.appendCoordinate(routeCoords[index]);
            previousIndex = index;
        }
    }
    previousIndex = index;
    if (index >= routeCoords.length-1) {
      stopAnimation(0, false, true);
      if(AnimationChannel !== undefined){
          AnimationChannel.postMessage('end');
      }
      return;
    }

    if(SliderChannel !== undefined){
        SliderChannel.postMessage(seekTime + speed * elapsedTime);
    }
    let currentPoint = new ol.geom.Point(routeCoords[index]);
    let feature = new ol.Feature(currentPoint);
    vectorContext.drawFeature(routeFeature, analysisStyles.route);
    vectorContext.drawFeature(feature, analysisStyles.geoMarker);
  }
  // tell OpenLayers to continue the postrender animation
  map.render();
};

var animateHeatMapFeature = function(event) {
  var vectorContext = ol.render.getVectorContext(event);
  var frameState = event.frameState;

  if (animating) {
    var elapsedTime = frameState.time - startTime - pauseTime;
    // here the trick to increase speed is to jump some indexes
    // on lineString coordinates
    let index = previousIndex;
    if(seekTime + speed * elapsedTime - routeTimestamps[previousIndex+1] >= 0) {
        while(index < routeCoords.length-1 && seekTime + speed * elapsedTime - routeTimestamps[previousIndex+1] >= 0) {
            index ++;
            heatmapFeaturesList[index].set('weight', 1);
            previousIndex = index;
        }
    }

    previousIndex = index;
    if (index >= routeCoords.length-1) {
      stopAnimation(1, false, true);
      if(AnimationChannel !== undefined){
          AnimationChannel.postMessage('end');
      }
      return;
    }

    if(SliderChannel !== undefined){
        SliderChannel.postMessage(seekTime + speed * elapsedTime);
    }
  }
  // tell OpenLayers to continue the postrender animation
  map.render();
};

function startSpaghettiAnimation(time = 0) {
  if (animating) {
    pauseAnimation(0);
  } else if(ended == true){
    if(AnimationChannel !== undefined){
        AnimationChannel.postMessage('play');
    }
    ended = false;
    synchronizeSpaghettiAnimationTime(time);
    animating = true;
    startTime = Date.now();
    pauseTime = 0;
    seekTime = time;
    // hide geoMarker
        geoMarker.setStyle(null);
        vectorAnalysisLayer.on('postrender', animateSpaghettiMapFeature);

    map.render();
  } else {
    resumeAnimation(0);
  }
}

function resumeAnimation(animationType = 0) {
    if(AnimationChannel !== undefined){
        AnimationChannel.postMessage('play');
    }
    let pauseEndTime = Date.now();
    pauseTime += pauseEndTime - pauseStartTime;
    animating = true;
    if(animationType == 0) {
        geoMarker.setStyle(null);
        vectorAnalysisLayer.on('postrender', animateSpaghettiMapFeature);
    } else {
        vectorHeatmapLayer.on('postrender', animateHeatMapFeature);
    }
    map.render();
}


/**
 * @param {boolean} ended end of animation.
 */
function stopAnimation(animationType = 0, seek = false, atEnd = false, isListening = true) {
    ended = true;
    animating = false;
    // if animation cancelled set the marker at the beginning
    if(seek == false) {
        if(animationType == 0) {
            let coord = atEnd ? routeCoords[routeLength - 1] : routeCoords[0];
            let geometry = geoMarker.getGeometry();
            geometry.setCoordinates(coord);
            let lineGeometry = routeFeature.getGeometry();
            if(atEnd == false) {
                lineGeometry.setCoordinates([routeCoords[0]]);
            }
        } else {
            if(atEnd) {
                //do nothing
            } else {
                //do nothing
            }
        }
    }
    if(isListening) {
        //remove listener
        if(animationType == 0) {
            vectorAnalysisLayer.un('postrender', animateSpaghettiMapFeature);
        } else {
            vectorHeatmapLayer.un('postrender', animateHeatMapFeature);
        }
    }
    if(AnimationChannel !== undefined && seek == false && atEnd == false){
        AnimationChannel.postMessage('stop');
    }
}

function pauseAnimation(animationType = 0) {
    pauseStartTime = Date.now();
    animating = false;

    if(animationType == 0) {
        let coord = routeCoords[previousIndex];
        let geometry = geoMarker.getGeometry();
        geometry.setCoordinates(coord);

        vectorAnalysisLayer.un('postrender', animateSpaghettiMapFeature);
    } else {
        vectorHeatmapLayer.un('postrender', animateHeatMapFeature);
    }
    if(AnimationChannel !== undefined){
        AnimationChannel.postMessage('pause');
    }
}

function seekSpaghettiAnimation(time) {
    stopAnimation(0, true);
    synchronizeSpaghettiAnimationTime(time);
    let coord = routeCoords[previousIndex];
    let geometry = geoMarker.getGeometry();
    geometry.setCoordinates(coord);
}

function seekHeatmapAnimation(heatmapStartTime, heatmapEndTime) {
    stopAnimation(1, true);
    synchronizeHeatmapAnimationTime(heatmapStartTime, heatmapEndTime);
}

function setSpaghettiSpeed(animationSpeed, time, isListening = true) {
    stopAnimation(0, true, false, isListening);
    speed = animationSpeed;
    synchronizeSpaghettiAnimationTime(time);
    let coord = routeCoords[previousIndex];
    let geometry = geoMarker.getGeometry();
    geometry.setCoordinates(coord);
}

function setHeatmapSpeed(animationSpeed, heatmapStartTime, heatmapEndTime, isListening = true) {
    stopAnimation(1, true, false, isListening);
    speed = animationSpeed;
    synchronizeHeatmapAnimationTime(heatmapStartTime, heatmapEndTime);
}

function synchronizeSpaghettiAnimationTime(time) {
    previousIndex = -1;
    let lineGeometry = routeFeature.getGeometry();
    lineGeometry.setCoordinates([]);
    for(const routeTimestamp of routeTimestamps){
        if(time < routeTimestamp) {
            break;
        }
        previousIndex ++;
        lineGeometry.appendCoordinate(routeCoords[previousIndex]);
    }
}

function synchronizeHeatmapAnimationTime(heatmapStartTime, heatmapEndTime) {
    for (var i = 0; i < routeTimestamps.length; i++) {
        if(routeTimestamps[i] >= heatmapStartTime && routeTimestamps[i] <= heatmapEndTime) {
            heatmapFeaturesList[i].set('weight', heatmapFeaturesList[i].get('duration')/600);
        } else {
            heatmapFeaturesList[i].set('weight', 0);
        }
    }
}

function setRadius(radius) {
    vectorHeatmapLayer.setRadius(radius);
}

function setBlur(blur) {
    vectorHeatmapLayer.setBlur(blur);
}
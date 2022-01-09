let report;
let pages;
// Get models. models contains enums that can be used.
models = window['powerbi-client'].models;

// Embed a Power BI report in the given HTML element with the given configurations
// Read more about how to embed a Power BI report in your application here: https://go.microsoft.com/fwlink/?linkid=2153590
function embedPowerBi(embedUrl, embedReportId, accessToken) {
    let tokenType = '1';
    let permissions = models.Permissions.All;
    let config = {
        type: 'report',
        tokenType: tokenType == '0' ? models.TokenType.Aad : models.TokenType.Embed,
        accessToken: accessToken,
        embedUrl: embedUrl,
        id: embedReportId,
        permissions: permissions,
        settings: {
            layoutType: models.LayoutType.MobilePortrait,
            panes: {
                filters: {
                    visible: false
                },
                pageNavigation: {
                    visible: false
                }
            }
        }
    };
    // Get a reference to the embedded report HTML element
    let embedContainer = $('#embedContainer')[0];
    // Embed the report and display it within the div container.
    report = powerbi.embed(embedContainer, config);
    // report.on will add an event handler
    report.on("loaded", async function () {
        exposeData();
    });
}

async function exposeData() {
    pages = await report.getPages();
    let log = "Report pages:";
    let results = [];
    for (var i = 0; i< pages.length; i++) {
        log += "\n" + pages[i].name + " - " + pages[i].displayName;
        log += "\n" + "Page Visuals:";
        let visuals = await pages[i].getVisuals();
        let resultPage = {
                "pageId"      : pages[i].name,
                "pageName"    : pages[i].displayName,
                "pageVisuals" : []
            }
        for (var j = 0; j< visuals.length; j++) {
            log += "\n" + visuals[j].name + " - " + visuals[j].title;
            let resultPageVisual = {"visualId":visuals[j].name, "visualName":visuals[j].title}
            try {
                let result = await visuals[j].exportData(models.ExportDataType.Summarized, 100);
                log += "\n" + "Visual data:";
                log += "\n" + result.data;
                resultPageVisual.visualData = result.data;
            } catch (e) {
                DebugChannel.postMessage("catch error");
                DebugChannel.postMessage(e);
            }
            resultPage.pageVisuals.push(resultPageVisual);
        }
        results.push(resultPage);
    }
    DebugChannel.postMessage(log);
    VisualDataChannel.postMessage(JSON.stringify(results));
}

function updatePage(pageId) {
    report.setPage(pageId);
}

async function showHideVisual(pageName, visualName, show) {
    try {
        DebugChannel.postMessage("active page name is: " + pageName);
        DebugChannel.postMessage("active page visual name is: " + visualName);
        DebugChannel.postMessage("active page visual visibility is: " + show);
        let page = await report.getPageByName(pageName);
        DebugChannel.postMessage("active page is: " + page);
        report.setVisualDisplayState(pageName, visualName, show?0:1);
    } catch(e) {
        DebugChannel.postMessage("update visual error");
    }
}

async function onVisualsDateChange(startDate, endDate, pageName, visualName)  {
    // Create the filter object. For more information see https://go.microsoft.com/fwlink/?linkid=2153364
    const filter = {
      $schema: 'http://powerbi.com/product/schema#advanced',
      target: {
        table: 'Date Shift',
        column: 'Date Shift',
      },
      filterType: models.FilterType.Advanced,
      logicalOperator: 'And',
      conditions: [
        {
          operator: 'GreaterThanOrEqual',
          value: startDate,
        },
        {
          operator: 'LessThanOrEqual',
          value: endDate,
        },
      ],
    };
    let page = await report.getPageByName(pageName);
    let visuals = await page.getVisuals();
    const slicer = visuals.filter((visual) => {
            return visual.type === 'slicer' && visual.title === 'Date';
          })[0];
    try {
        await slicer.setSlicerState({ filters: [filter] });
        DebugChannel.postMessage("date filter Done");
        exposeData();
    } catch(e) {
        DebugChannel.postMessage("date filter error:" + JSON.stringify(e));
    }
  }

function initWebViewDimensions(mapDivision, height) {
    document.getElementById(mapDivision).setAttribute("style","width:100%; height:"+height+"px");
}

/*
report.setVisualDisplayState -> will be used to show / hide an visual

/*
Report Docs -> https://docs.microsoft.com/en-us/javascript/api/powerbi/powerbi-client/report.report
Page Docs -> https://docs.microsoft.com/en-us/javascript/api/powerbi/powerbi-client/page.page
Visual Docs -> https://docs.microsoft.com/en-us/javascript/api/powerbi/powerbi-client/visual.visual
update filter docs -> https://docs.microsoft.com/en-us/javascript/api/overview/powerbi/control-report-filters#basic-filter
*/
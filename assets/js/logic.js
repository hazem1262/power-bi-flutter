function initWebViewDimensions(mapDivision, height){
    document.getElementById(mapDivision).setAttribute("style","width:100%; height:"+height+"px");
}

let loadedResolve, reportLoaded = new Promise((res, rej) => { loadedResolve = res; });
let renderedResolve, reportRendered = new Promise((res, rej) => { renderedResolve = res; });
let report;
let pages;
// Get models. models contains enums that can be used.
models = window['powerbi-client'].models;

// Embed a Power BI report in the given HTML element with the given configurations
// Read more about how to embed a Power BI report in your application here: https://go.microsoft.com/fwlink/?linkid=2153590
function embedPowerBi(embedUrl, embedReportId, accessToken) {
    let tokenType = '1';
    // We give All permissions to demonstrate switching between View and Edit mode and saving report.
    let permissions = models.Permissions.All;
    // Create the embed configuration object for the report
    // For more information see https://go.microsoft.com/fwlink/?linkid=2153590
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

    // report.off removes all event handlers for a specific event
    report.off("loaded");

    // report.on will add an event handler
    report.on("loaded", async function () {
        exposeData();
    });

    // report.off removes all event handlers for a specific event
    report.off("error");

    report.on("error", function (event) {
        console.log(event.detail);
    });

    // report.off removes all event handlers for a specific event
    report.off("rendered");

    // report.on will add an event handler
    report.on("rendered", function () {
        renderedResolve();
        report.off("rendered");
    });
}

async function exposeData() {
    loadedResolve();
    report.off("loaded");
    pages = await report.getPages();
    let log = "Report pages:";
    let results = [];
    for (var i = 0; i< pages.length; i++) {
        log += "\n" + pages[i].name + " - " + pages[i].displayName;
        log += "\n" + "Page Visuals:";
        let visuals = await pages[i].getVisuals();
//        pages[i].visuals = visuals;
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
    DebugChannel.postMessage("before");
    VisualDataChannel.postMessage(JSON.stringify(results));
    DebugChannel.postMessage("after");

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


async function getVisualsData(pageName, visualName) {
    DebugChannel.postMessage("Page Name: " + pageName);
    DebugChannel.postMessage("Page Visual: " + visualName);
    let page = await report.getPageByName(pageName);
    let reportFilers = await report.getFilters();
    DebugChannel.postMessage(JSON.stringify(reportFilers));
    let visual = await page.getVisualByName(visualName);
    let results = await visual.exportData(models.ExportDataType.Summarized, 100);
    let pageFilers = await page.getFilters();
    DebugChannel.postMessage(JSON.stringify(pageFilers));
    let visualFilers = await visual.getFilters();
    DebugChannel.postMessage(JSON.stringify(visualFilers));

    DebugChannel.postMessage("results done");
    VisualDataChannel.postMessage(JSON.stringify(results));
    let advancedTeamFilter = {
      $schema: "http://powerbi.com/product/schema#advanced",
      target: {
        table: "Team (Current)",
        column: "CrewName"
      },
      logicalOperator: "Is",
      conditions: [
        {
          operator: "Contains",
          value: "Finishing - TEAM"
        }
      ],
      filterType: models.FilterType.AdvancedFilter
    }
    let advancedDateFilter = {
      $schema: "http://powerbi.com/product/schema#advanced",
      target: {
        table: "Date Shift",
        column: "Date Shift"
      },
      logicalOperator: "Is",
      conditions: [
        {
          operator: "Contains",
          value: "2021-12-28 00:00:00"
        }
      ],
      filterType: models.FilterType.AdvancedFilter
    }
    let filter = {
        "$schema":"http://powerbi.com/product/schema#basic",
        "target": {
            "table":"Team (Current)",
            "column":"CrewName"
        },
        "filterType":1,
        "displaySettings": {
            "isHiddenInViewMode":false
        },
        "operator":"All",
        "values":["Finishing - TEAM"],
        "requireSingleSelection":false
    }
    report.getFilters().then(function (allTargetFilters) {
        allTargetFilters.push(filter);
        allTargetFilters.push(advancedTeamFilter);
        allTargetFilters.push(advancedDateFilter);

        // Set filters
        // https://microsoft.github.io/PowerBI-JavaScript/interfaces/_src_ifilterable_.ifilterable.html#setfilters
        report.setFilters(allTargetFilters);
    });
//    await report.updateFilters(models.FiltersOperations.ReplaceAll, [filter])
}

/*async function onVisualsDateChange(startDate, endDate)  {

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

    // Retrieve the page collection and get the visuals for the active page.
    try {
      // @ts-ignore
      // eslint-disable-next-line no-shadow
      const pages = await MyReport?.getPages();
      // Retrieve the active page.
      // eslint-disable-next-line no-shadow
      const page = pages.filter((page: any) => {
        return page.isActive;
      })[0];

      const visuals = await page.getVisuals();

      // Retrieve the target visual.
      const slicer = visuals.filter((visual: any) => {
        return visual.type === 'slicer' && visual.title === 'Date';
      })[0];

      // Set the slicer state which contains the slicer filters.
      await slicer.setSlicerState({ filters: [filter] });
      // await page.updateFilters(models.FiltersOperations.Add, [filter]);
      // console.log('Page filter was added.');
    } catch (errors) {
      console.log(errors);
    }
  }*/

function addFilter() {

}
/*
report.setVisualDisplayState -> will be used to show / hide an visual

/*
Report Docs -> https://docs.microsoft.com/en-us/javascript/api/powerbi/powerbi-client/report.report
Page Docs -> https://docs.microsoft.com/en-us/javascript/api/powerbi/powerbi-client/page.page
Visual Docs -> https://docs.microsoft.com/en-us/javascript/api/powerbi/powerbi-client/visual.visual
update filter docs -> https://docs.microsoft.com/en-us/javascript/api/overview/powerbi/control-report-filters#basic-filter
*/
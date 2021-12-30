function initWebViewDimensions(mapDivision, height){
    document.getElementById(mapDivision).setAttribute("style","width:100%; height:"+height+"px");
}
function embedPowerBi(embedUrl, reportId, token){
    if(DebugChannel !== undefined) {
                DebugChannel.postMessage("test channel communication");
                embedPowerBIReport()
//                await reportLoaded;

                // Insert here the code you want to run after the report is loaded

//                await reportRendered;
            }
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
            panes: {
                filters: {
                    visible: true
                },
                pageNavigation: {
                    visible: true
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
        loadedResolve();
        report.off("loaded");
        pages = await report.getPages();
        let log = "Report pages:";
        for (var i = 0; i< pages.length; i++) {
            log += "\n" + pages[i].name + " - " + pages[i].displayName;
            log += "\n" + "Page Visuals:";
            let visuals = await pages[i].getVisuals();
            for (var j = 0; j< visuals.length; j++) {
                log += "\n" + visuals[j].name + " - " + visuals[j].title;
                try {
                    let result = await visuals[j].exportData(models.ExportDataType.Summarized, 2);
                    log += "\n" + "Visual data:";
                    log += "\n" + result.data;
                } catch (e) {
                    DebugChannel.postMessage("catch error");
                    DebugChannel.postMessage(e);
                }

//
//
            }
        }

        DebugChannel.postMessage(log);
        console.log(log);
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

//embedPowerBIReport();
//await reportLoaded;
//
//// Insert here the code you want to run after the report is loaded
//
//await reportRendered;
//
//// Insert here the code you want to run after the report is rendered

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
function initWebViewDimensions(mapDivision, height){
    document.getElementById(mapDivision).setAttribute("style","width:100%; height:"+height+"px");
}
function testCommunications(){
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
function embedPowerBIReport() {
    /*-----------------------------------------------------------------------------------+
    |    Don't change these values here: access token, embed URL and report ID.          |
    |    To make changes to these values:                                                |
    |    1. Save any other code changes to a text editor, as these will be lost.         |
    |    2. Select 'Start over' from the ribbon.                                         |
    |    3. Select a report or use an embed token.                                       |
    +-----------------------------------------------------------------------------------*/
    // Read embed application token
//    let accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1yNS1BVWliZkJpaTdOZDFqQmViYXhib1hXMCIsImtpZCI6Ik1yNS1BVWliZkJpaTdOZDFqQmViYXhib1hXMCJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvOGQzNWJhMjEtNGJhNy00YTQ1LWFjYTAtMmU0OTA5MmQ1NTE4LyIsImlhdCI6MTY0MDY3NTk3NiwibmJmIjoxNjQwNjc1OTc2LCJleHAiOjE2NDA2Nzk5NTQsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJFMlpnWVBDTzJWODMyeTlKOGFQVzgyVXplVnVtUlMvSm02alpLWEg4YWw1VjBVNk5uRllBIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjYyNmZhZjc3LWYzNTYtNGI2ZS1iZWZiLWJmYTNkNDg5NGVmYSIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiSGF6ZW0iLCJnaXZlbl9uYW1lIjoiQXNocmFmIiwiaXBhZGRyIjoiMTA1LjE5Ni4xOTUuMTI1IiwibmFtZSI6IkFzaHJhZiBIYXplbSIsIm9pZCI6IjgxNzYzZTM5LThjYjMtNGUwMi1hNGRiLTZiYmE4MzAwZWM0NSIsInB1aWQiOiIxMDAzMjAwMEM1RjQyQzc0IiwicmgiOiIwLkFUQUFJYm8xamFkTFJVcXNvQzVKQ1MxVkdIZXZiMkpXODI1THZ2dV9vOVNKVHZvd0FBcy4iLCJzY3AiOiJBcHAuUmVhZC5BbGwgQ2FwYWNpdHkuUmVhZC5BbGwgQ2FwYWNpdHkuUmVhZFdyaXRlLkFsbCBDb250ZW50LkNyZWF0ZSBEYXNoYm9hcmQuUmVhZC5BbGwgRGFzaGJvYXJkLlJlYWRXcml0ZS5BbGwgRGF0YWZsb3cuUmVhZC5BbGwgRGF0YWZsb3cuUmVhZFdyaXRlLkFsbCBEYXRhc2V0LlJlYWQuQWxsIERhdGFzZXQuUmVhZFdyaXRlLkFsbCBHYXRld2F5LlJlYWQuQWxsIEdhdGV3YXkuUmVhZFdyaXRlLkFsbCBSZXBvcnQuUmVhZC5BbGwgUmVwb3J0LlJlYWRXcml0ZS5BbGwgU3RvcmFnZUFjY291bnQuUmVhZC5BbGwgU3RvcmFnZUFjY291bnQuUmVhZFdyaXRlLkFsbCBXb3Jrc3BhY2UuUmVhZC5BbGwgV29ya3NwYWNlLlJlYWRXcml0ZS5BbGwiLCJzdWIiOiJRSUJ5bmdfNHZBZ0dESlJYZUVXQ3BHbGdfXzZIdHlCeDRSUkdhWGJoWU1nIiwidGlkIjoiOGQzNWJhMjEtNGJhNy00YTQ1LWFjYTAtMmU0OTA5MmQ1NTE4IiwidW5pcXVlX25hbWUiOiJhLmhhemVtQG5vdXNkaWdpdGFsLm5ldCIsInVwbiI6ImEuaGF6ZW1Abm91c2RpZ2l0YWwubmV0IiwidXRpIjoib3lTRkRBZUVEVS1xUnkyYTctaFlBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il19.It6tzQ4TPr6tgCnNAPhfLa19pFDSNeC5USOWk00pRhujua8alEHD5sTLNL-oHWTAGpmMYJ780Ov5ydAC-KhJhPHduT_yyvkJVG-YxPY83GmIsao7IXReQpueD62xcqE8Uo6QxT0paCYFge87_Ji-b20ZD4lO1F8Ngbz2d0CP8RRV1XR6feaF_dnVlXedmIPr8h-R6liEVENdKGFJEdB9IxV2j8AjBgxez46OmgaSQjKyRAcGy9IfUeNtnE2OvjrSXELaTacRl9BPI_9eZUheqUTvfJzflU04BApzO8-a1oCJ8HGYz7zmwg8my-abqPJkdu7pNG1FINFlq50G3GE5SQ";
    let accessToken = "H4sIAAAAAAAEAB2Tt66sWgIF_-WkjIR3I92AxntoYGMybOOh8fD0_n3OnXxFtar--XHSu5_S4ue_P8W4frM6OSmtn-OAw5ogGft9c7veww8J4gi-vo7YgUW6u0uiboA-FryNRlSPhXUEw2hEzAcVlJqgix-MGjIog1DMGZ8blQ8sA0mKdUJ-Zldmoq91OzXSGEvLlmtX81UObgoy__SorfA4d2duxLaOAqK45l7YUNjwOyIolXKFpYIMGjMYEvcmj3FoYpsQ_MTIMpW8yd5sguaQbO3Xz3LP8Zdf7AI8nVgoCsFYHfsYZFzb-xHh7_6m8MLqNizRqBdR-MNsdQPqOUFlpUSRxCkr8yzreumNJF4CgsSoZGKDe77zBWE_TOulbKseuO-Vg_v481p8jIl6TLjRQdmloLQE-iPWqyKerE-O33k-TTEJDvGTaZodPPTNVy7VmfOgByE3JxOgP4UlfpD5oPNLL0tNz74sS_D0HeStP8O7XqNS8831mfECbNmVGkukOxd4VdNJn1NCgaFjHw4dPHnFkSg4OfN1X-AoQax7A1V4GdhL1xZut9OIQB_PpasGH1mWmrUW4YwbT4inYzkPZNNVHRJC1_6kTKTXPdk4eFVvqw3ZQwXb-aGW9251Zc-jSMv1IMUsznHKbKoheFhKNtiBhGWYanp0X0s5Phdf1UsWdVq90ApJCMqcxHriL7TYIPCTLZi_0VKecC-_Tk0JgIuOZ-RzoXTf5lRVCi_K5OpMmD4bep7ryDFs1PvbJ3KmJt7YE-abRMEhW_IRHSDHxvJrTK_AYjVIGfDVWuqdo9Ql5AaNzvnU1jyEFKFE47pIXODgXKkELU3Wbqad4rCTXlqN9q0q-IBJ517PoBMM9uFuM-1mC46ZWP2GXhBi_s1uRNpe2hgfdFPy489_fvhf6bZJL-_fnJR8n-1Dmd_s5hjS7EmY9QUAlA80adVYiE2sd9Q5OkHyQCOeScLD9vM1Wiewn1xTee-tZx6a8ROTYI3_CGI3WsF16f12RspbkvzuAdHD9LWsnR7wxx1d39-d5Ysk1IlEr3nk8zqvdjjLMLbuK4Lv4zWrA5AmsGHDozHzSR4wSsS0oV2lZSk6joGk-BDtSgrvAS8v-bnaa48L1tg0_9nWAGkMukPakIp5J3_fT82SD7g5t4E8mzEY02xpRPLdc-AC-PVldQDhhcE754VZ1EePTLryErrc0CnGXo9OKDLWelMD7_AAINEgjm4Bv03TZAXrEwS5DLaKC7oUbvsapeRSvxJy_vnzF_M91-Wigl_KbfhX2fA6VL6wnHfh-rB9c_9fec1nTLd9KX9nttXz0SB3qeEVHsO9uoxh506_0NJumYgwJIBj5tNndf9g5oKnCuMTXcWOQSh3spOY8RTcqy82pXHQSFnFyR6ZZNOQwdxGafCbU48MQP3wITcpEgNvN-kDqUAukz8HKVprNQfjF3Zpt6KEaLoYzjexfGs1m9EIPBX6JNA6GjYVUDirTLYaVfMSX2ucLgF0EhjFW1IKcYztkAR5IN1jhwIhIac9FTNAkEJPEghhs8reKQHP2-DATyNJDHbN8_t2_C_xidi0Uur7kAlOIe4neA8dCmLmJpR1movI3uO6m1rNidpjh9FqOw2en12X6SJ9JEed8eIUIuvgkZrdJDwIb0BA_z3j3_8BL-6PU0IGAAA=.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVdFU1QtRVVST1BFLUItUFJJTUFSWS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsibW9kZXJuRW1iZWQiOmZhbHNlfX0=";

    // Read embed URL
//    let embedUrl = "https://app.powerbi.com/reportEmbed?reportId=f48b9c40-cf4c-4e5d-9ec5-8c1a530c2c1b&autoAuth=true&ctid=8d35ba21-4ba7-4a45-aca0-2e49092d5518&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtZXVyb3BlLWUtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D";
    let embedUrl = "https://app.powerbi.com/reportEmbed?reportId=63533d2b-824a-4427-95f3-a3327c8ab6e8&groupId=3e3a5a50-c664-4507-a1e5-4c97611e73cc&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVdFU1QtRVVST1BFLUItUFJJTUFSWS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsibW9kZXJuRW1iZWQiOnRydWUsImFuZ3VsYXJPbmx5UmVwb3J0RW1iZWQiOnRydWUsImNlcnRpZmllZFRlbGVtZXRyeUVtYmVkIjp0cnVlLCJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZX19";

    // Read report Id
//    let embedReportId = "f48b9c40-cf4c-4e5d-9ec5-8c1a530c2c1b";
    let embedReportId = "63533d2b-824a-4427-95f3-a3327c8ab6e8";

    // Read embed type from radio
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
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
    let accessToken = "H4sIAAAAAAAEACWUt66EVgAF_-W1WCKzYMnFkllyuoSOnHNasPzvfpb7qUZnzt8_VnL3U5L__PmDVuQ8ak5qp4hM6zLVPrvs-Ea5bBSauId1ezRu-UhhHWljOd7LpE0dukpWTLrpo-2aliBfL8wayg4Sk_dPJQQ5aTI-I26DVquoQV-0e4SRnefSRd-N90k1OfVOGOiAZicVZ2AZr90v1eDPqYuOuxDThgparIJMQGy9ggIsgKcCXjLujM5teekwK7-xWIEELi2tlmMmSh6ZCvali3r8c4sMaLknV7DAcdfKPNuj7p6WCeJSbhiKKxmokkObMVCZdOoFAb7qyi544vcb6DPB2E45UZCWlm6ab6gJMQ_7nW7xraXk68ULBpsEk_aSJL85SVf9Hl1mWdw3MOPLRS_0RHsDl6I7D6MJ8nbYaAIBCDV1gZpIEmaX70P4Kp4u0z4VHlpmrpIhtE_dlt0tajCe9FFSFgqfW9Q3lTgniT0616aK1JRXZrE6XwnhZ4j0oM5MnuDGgiOZubHz2bGl9uYGLmwSItY2JWrxejRCoTjI9jhJfXjYOt5bVI9YVliueiouye4-0wVTUw0CxdsWFdu6tK4wTaOCG4BxphskYYLNyae4zjP1WknulsZNrFzZgHEHJtrBqV8w8lDIoWJUtMipI_ZXTCmwjX91enDv5YULa_XtdqGYSZ0l7_JjalnM-XwviEWg5zUhifcdfoRXgQGykDbROVPdT-Ad46gPhq0QnVDOjIVLtLIiTDJlz6_uuget4h28VTlXGqu0Zidzu2H6pxxYSVVW-4PkHxlVC2nw8nFYQ8l1Z5SFRjP0PQwordILBERmz-Vu_bgAuk4dxGc7wd_FBpW0K6mRGTP1QRTOrOnURcLKqY6sGk9YpRSRZyF2uXTV-P3zxw-33vM-qcX9m5N_nLf_etTY6V1AgIsLrcNiA2tOD7sPkWqHgXCBZHrFTUASW-RWJDUNWjELZAnWxjxg9pTxcQQOKAKA1sZ8QRwh3IYgJluoNLdRYx0m9bTDo0VB0MmrXkZ5i7SKuUbGfok-twr203NMPIXiJTRUUYiBWJR-xcD9gJXWNiyuoJbVKe5bHDnPsDULdfTxlqLQzgRgx6qj3eFi3kwyy04OQNZK11FKdUtzJppFZG-6elryK57vLo59nmV_X-JsOI5aWuvLuUm_XhaxWM_VxxCWv0t5JFKvuCJPv6HNioRgsHUVnw8EE0L2e9oDzxkkf7awwDUfF6IbsJQ04uKrvxQwrmzm9ddf_2m-57pYFfBr-Unwq_XrtUlIBrtBxzAdxP1PuU01JvuxFr_YYWebXHiAPYiOjSziKGueYRGY5DwqyBL-xXmVYtpNrGX1S8a7XhXVaftWEd9TDxnLVdOvHblzt3lKLfgSp8TX-ernVcPMqzRzh2xCHj8pasSJSoCsZSjTn3HRx6P_5nsgfudkbdVz9Rslyge9ZQjVRO2Q1cIYIx-Ls3a45VOYxwxVmvZxvxPTW8EtW03StJ1qiC0TeW9uxhocyZkIVftxV7mMlORAG-k3Ttwai1lTNX-41mHfsCWNyu9K-PRuhpZloTQRXGpUbYyij3Db6kNNpkjFg-mOPttNy6mJavf4QUL4AxvMTNqlxavlau_UELWh-Zib0GxQt6xSLoEzXMXR3f3_NP_zLyQLiPdCBgAA.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVdFU1QtRVVST1BFLUItUFJJTUFSWS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsibW9kZXJuRW1iZWQiOmZhbHNlfX0=";

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
    let visual = await page.getVisualByName(visualName);
    let results = await visual.exportData(models.ExportDataType.Summarized, 100);
    DebugChannel.postMessage("results done");
    VisualDataChannel.postMessage(JSON.stringify(results));
}


/*
report.setVisualDisplayState -> will be used to show / hide an visual
*/

/*
Report Docs -> https://docs.microsoft.com/en-us/javascript/api/powerbi/powerbi-client/report.report
Page Docs -> https://docs.microsoft.com/en-us/javascript/api/powerbi/powerbi-client/page.page
Visual Docs -> https://docs.microsoft.com/en-us/javascript/api/powerbi/powerbi-client/visual
*/
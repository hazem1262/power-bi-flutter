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
    let accessToken = "H4sIAAAAAAAEACWTtY7FBgAE_-VaRzJTpBRmtp8ZOjMzPTvKv-ei9FPNzv7980mfYU6Lnz9_Xna6hQSatkBTascTsi0rFpWpQTTntf72SMp2ShoaYJSoz6yXoSCnzmWp_Tnwj7Xoh9jo-mlEBjkRDAHNRYTxPd7nW5Az8wqCmPLUZiQHUAiWP8DDhhhYe7Nzg50y50uYLQ8eHnYPdysnmV4A7Jlo1tanNO-FwavvPEtZl9CcVMV-xIoPMYYRX0XTRKYHnNjnxb9G9_SHKooV-gouP5pcJs7jwW_FCrcxC8kpBQ6YK-ggMLsU7XQr6qkMwSZnGjyxvdcOgDq8A_QscmNml-QQDIqW662bF1lMUxhIyL-pBbXmJXkpctM9Tl3RkBHerD8rETb2DOtF0ufPuHLWI2ByjXgDqXrNeYJqvHygWTQkPTqI3vZwdGxXV-6wiqwaYoTf5QDYhSAT8W5Y3XiwEwVN7nXtTWGvaHRTZBlyUuW0bkQzLLHTUYXhi4bXi-QA8-vNcyBWFFYZvBueFxXC1SOihq5PG7LNY7_ys3Dze05rWHHS6DBQaAeWU00odfMxDzc7sMDBf1f0VZBIE_gsdUyLbOnzrCHWKptLRKBnrEDBYqekubCijH365TomUbKb8mIsCDeVNKSs8bgax8l2zrh-Y3Ux1pEPcyXGeuUdWNEJvx1ePSFf4TkXQqZlFKNQOSoBNNL12-WjoxE5FHVOOccYx_U6Y5Xm8EbsTdaCyzRGum3QnTkXkV_hDtaatlTXAhXqlLIpc152gPxYUMVQxigTeualmrgj5aZi31N_v2vIg0sb0m2riBbh-Pka6gs82ePakxlTReRXMSkWJuVurjYirHUUi-AdhAiQSj3WO2kHoHOsYMbyVtu5_nB9wOODEcOonfg_f_xw27Mcs1Y-v3dqV-vJHuKRAMKoFJoBh2et8kB__Kfc6Wm71C6hYKzJeQHYajjdVYIbVgJeizscszWzcFHkxkFcilyl5GH6ipDjMW4MIgy498OlyxWMGrFenJY_tUH48cPCceWJRe2Mg3abhvcmVhlGzoKz3x77TPTEm7XNLlW_38IJG7_OQ2Vz-bAq9fZ4GY4aygvSAeliM8B77Ic6HRk8K2OsoXofiT_cdLNhQoklLPURMl0lDcU-y1uMjJ6Wtk_xitL6VoZ8vvgEDGwxA8ct21kOshpKspd1ChPtdgyruOJ83d7cv9McF-zouNeV0Hj_kq-ELyQ0oiuWAIZKObIQuduh3dZU49Xpd_Zff_2n-VmaclOCX8uw327GW3yNhxCfiiCzWCSg_ym3raf0OLfyFys48BiIPabvzHZfJqzxHcdOAZTDXIsQVpI3-akrCz_leIjQ0kl253tJbihqtt1hpJ0GmvULMBk_U2V5V8fWcoT-QLIj2zIm-9jllH5_BaG4fwCNEuwlUMw-0AIGmvKWCuwYuAiRLoL1XaH3S16h0eQIB2UuTQNXhSWCAqCZbs4IJmKm9M0i3pqeQAr23WVJ-IoVHvU4JHqHXTa5XRB6690NT-q_uAdG5pDuX9XcXbgsLB38jVf0TkILbJUXAkyfncxpe2-iNaY6sFlTjMSqHEctWxAcnEABUfPzwm3jzouZKfC2BrR2zmCyZk1h19073905JGHz8WK3y9d7XfeutPW7_tX8z7-qGKCuQgYAAA==.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVdFU1QtRVVST1BFLUItUFJJTUFSWS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsibW9kZXJuRW1iZWQiOmZhbHNlfX0=";

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
        let pages = await report.getPages();
        let log = "Report pages:";
        for (var i = 0; i< pages.length; i++) {
            log += "\n" + pages[i].name + " - " + pages[i].displayName;
            log += "\n" + "Page Visuals:";
            let visuals = await pages[i].getVisuals();
            visuals.forEach(function (visual) {
                log += "\n" + visual.name + " - " + visual.title;
            });
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

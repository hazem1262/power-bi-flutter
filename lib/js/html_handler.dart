import 'package:bower_bi/js/i_html_handler.dart';

class HtmlHandler implements IHtmlHandler {
  @override
  String getIndexFile(String powerBiJsPath, String logicJsPath, String jqueryPath) {
    return '''
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
          <meta charset="utf-8">
        
          <style>
            .$powerBiEmbededDivision {
              width: 100%;
              height: 100%;
            }
          </style>
          <script src="$jqueryPath"></script>
          <script src="$powerBiJsPath"></script>
          <script src="$logicJsPath"></script>
      
          <title>Power Bi Demo</title>
        </head>
        <body>
          <div id="$powerBiEmbededDivision" class="$powerBiEmbededDivision"></div>
        </body>
      </html>
    ''';
  }
}

const String powerBiEmbededDivision = 'embedContainer';

// <iframe title="Customer Profitability Sample - Team Scorecard" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=f48b9c40-cf4c-4e5d-9ec5-8c1a530c2c1b&autoAuth=true&ctid=8d35ba21-4ba7-4a45-aca0-2e49092d5518&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtZXVyb3BlLWUtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D" frameborder="0" allowFullScreen="true"></iframe>
import 'package:bower_bi/js/html_handler.dart';
import 'package:bower_bi/js/i_javascript_handler.dart';

class JavascriptHandler implements IJavascriptHandler {
  @override
  String getTestCommunications() {
    return '''
      testCommunications();
    ''';
  }

  @override
  String getInitWebViewDimensionsFunction(double height) {
    return '''
    initWebViewDimensions("$powerBiEmbededDivision", $height);
  ''';
  }

  @override
  String getVisualsData(String pageName, String visualName) {
    return '''
    getVisualsData("$pageName", "$visualName");
  ''';
  }
}

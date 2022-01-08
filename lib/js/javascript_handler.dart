import 'package:bower_bi/js/html_handler.dart';
import 'package:bower_bi/js/i_javascript_handler.dart';

class JavascriptHandler implements IJavascriptHandler {
  @override
  String getEmbedPowerBi({required String embedUrl, required String reportId, required String token}) {
    return '''
      embedPowerBi("$embedUrl", "$reportId", "$token");
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

  @override
  String getUpdatePageVisuals(String pageId, String visualId, bool isVisible) {
    return '''
    showHideVisual("$pageId", "$visualId", $isVisible);
  ''';
  }

  @override
  String getUpdateVisiblePage(String pageId) {
    return '''
    updatePage("$pageId");
  ''';
  }

  @override
  String getOnVisualsDateChange(String startDate, String endDate, String pageId, String visualId) {
    return '''
    onVisualsDateChange("$startDate", "$endDate", "$pageId", "$visualId");
    ''';
  }
}

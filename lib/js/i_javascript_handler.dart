abstract class IJavascriptHandler {
  String getEmbedPowerBi({required String embedUrl, required String reportId, required String token});
  String getInitWebViewDimensionsFunction(double height);
  String getVisualsData(String pageName, String visualName);
  String getUpdateVisiblePage(String pageId);
  String getUpdatePageVisuals(String pageId, String visualId, bool isVisible);
  String getOnVisualsDateChange(String startDate, String endDate, String pageId, String visualId);
}

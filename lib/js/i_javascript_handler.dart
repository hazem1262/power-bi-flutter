abstract class IJavascriptHandler {
  String getEmbedPowerBi({required String embedUrl, required String reportId, required String token});
  String getInitWebViewDimensionsFunction(double height);
  String getVisualsData(String pageName, String visualName);
}

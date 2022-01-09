import 'dart:convert';
import 'package:bower_bi/data/embed_report_entity.dart';
import 'package:bower_bi/data/report_pages_entity.dart';
import 'package:bower_bi/js/bundle_handler.dart';
import 'package:bower_bi/js/html_handler.dart';
import 'package:bower_bi/js/i_javascript_handler.dart';
import 'package:bower_bi/js/javascript_handler.dart';
import 'package:bower_bi/js/local_storage_handler.dart';
import 'package:bower_bi/js/web_view_service.dart';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:http/http.dart' as http;
import 'package:syncfusion_flutter_charts/charts.dart';

class DailyReportScreen extends StatefulWidget {
  const DailyReportScreen({Key? key}) : super(key: key);

  @override
  _DailyReportScreenState createState() => _DailyReportScreenState();
}

class _DailyReportScreenState extends State<DailyReportScreen> {

  List<GDPData>? activeVsInactiveData;
  late WebViewController _webViewController;
  final IJavascriptHandler javascriptHandler = JavascriptHandler();
  late WebViewService _webViewService;
  String selectedValue = '';
  List<ReportPagesEntity> availablePages = [];
  ReportPagesEntity? selectedPage;
  List<ReportPagesPageVisuals> availableVisuals = [];
  bool isLoading = true;
  List<String> dates = [];
  String selectedDate = '';
  String? inActiveWorkers;
  String? activeWorkers;
  String? offLineWorkers;
  String? activeVsExpected;
  String? totalWorkers;
  @override
  void initState() {
    super.initState();
    _webViewService = WebViewService(
        localStorageHandler: LocalStorageHandler(),
        bundleHandler: BundleHandler(),
        htmlHandler: HtmlHandler()
    );
  }

  final GlobalKey heightKey = GlobalKey();
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: FutureBuilder(
          future: _webViewService.initWebViewUri(),
          builder: (context, snapshot) {
            return snapshot.hasData ? ListView(
              children: [
                if(selectedPage == null)
                  SizedBox(
                    height: MediaQuery.of(context).size.height,
                    child: const Center(child: CircularProgressIndicator()),
                  ),
                if(selectedPage != null)
                ...[
                  Image.asset('assets/images/wake_cap_icon.png', width: 80, height: 80,),
                  const Center(child: Text('Wakecap', style: TextStyle(fontSize: 24),)),
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: DropdownButtonFormField<String>(
                        value: selectedDate,
                        isExpanded: true,
                        decoration: const InputDecoration(
                          border: OutlineInputBorder(),
                        ),
                        onChanged: (String? newValue) {
                          selectNewDate(newValue);
                        },
                        items: dates.map(
                                (String date) => DropdownMenuItem<String>(
                                value: date,
                                child: Text(date.replaceAll('00:00:00', ''), overflow: TextOverflow.ellipsis,)
                            )
                        ).toList()
                    ),
                  ),
                  if(activeVsInactiveData != null) SfCircularChart(
                    title: ChartTitle(text: 'Active Vs Expected Workers'),
                    series: <CircularSeries>[
                      RadialBarSeries<GDPData, String>(
                        maximumValue: double.parse(activeVsExpected?.split(',')[1]??'0'),
                        dataLabelSettings: const DataLabelSettings(isVisible: true, angle: 90,),
                        enableTooltip: true,
                        dataSource: activeVsInactiveData,
                        xValueMapper: (data, _) => data.continent,
                        yValueMapper: (data, _) =>  data.gdp
                      )
                    ],
                  ),
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          children: [
                            Text(activeWorkers??'', style: const TextStyle(color: Colors.greenAccent, fontSize: 18),),
                            const Text('Active', style: TextStyle(color: Colors.greenAccent, fontSize: 18)),
                          ],
                        ),
                      ),
                      Expanded(
                        child: Column(
                          children: [
                            Text(inActiveWorkers??'', style: const TextStyle(color: Colors.orangeAccent, fontSize: 18)),
                            const Text('Inactive', style: TextStyle(color: Colors.orangeAccent, fontSize: 18)),
                          ],
                        ),
                      ),
                      Expanded(
                        child: Column(
                          children: [
                            Text(offLineWorkers??'', style: const TextStyle(color: Colors.redAccent, fontSize: 18)),
                            const Text('Offline', style: TextStyle(color: Colors.redAccent, fontSize: 18)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const Divider(),
                  Center(child: Text(totalWorkers??'', style: const TextStyle(color: Colors.black, fontSize: 22))),
                  const Center(child: Text('Total Workers', style: TextStyle(color: Colors.black, fontSize: 22))),
                ],
                SizedBox(
                  height: 50,
                  child: Opacity(
                    opacity: 0,
                    child: WebView(
                      key: heightKey,
                      initialUrl: _webViewService.uri.toString(),
                      javascriptMode: JavascriptMode.unrestricted,
                      javascriptChannels: {
                        JavascriptChannel(
                            name: _jsDebugChannel,
                            onMessageReceived: (JavascriptMessage msg) {
                              print(msg.message);
                            }
                        ),
                        JavascriptChannel(
                            name: _jsVisualDataChannel,
                            onMessageReceived: (JavascriptMessage msg) {
                              var reportPages = json.decode(msg.message);
                              List<ReportPagesEntity> pages = (reportPages as List).map((p) => ReportPagesEntity().fromJson(p)).toList();
                              initializePages(pages);
                              print(msg.message);
                            }
                        )
                      },
                      onWebViewCreated:
                          (WebViewController webViewController) {
                        _webViewController = webViewController;
                      },
                      onPageFinished: (_) async {
                        getReportDetails();
                      },
                    ),
                  ),
                ),
              ],
            ): const Center(child: CircularProgressIndicator());
          }
        ),
      ),
    );
  }

  getReportDetails() async {
    http.Response response = await http.get(Uri.parse(reportsEndPoint),);
    EmbedReportEntity report = EmbedReportEntity().fromJson(json.decode(response.body));
    await _webViewController.evaluateJavascript(
        javascriptHandler.getEmbedPowerBi(
            embedUrl: report.embedReport?.first.embedUrl??'',
            reportId: report.embedReport?.first.reportId??'',
            token: report.embedToken?.token??''
        )
    );
    final keyContext = heightKey.currentContext;
    await _webViewController.evaluateJavascript(javascriptHandler
        .getInitWebViewDimensionsFunction(keyContext!.size!.height));
  }

  void initializePages(List<ReportPagesEntity> pages) {
    setState(() {
      selectedPage = pages.first;
      availableVisuals = selectedPage?.pageVisuals??[];
      availablePages = pages;
      List<ReportPagesPageVisuals> dailyReportVisuals = pages[0].pageVisuals!;
      dates = getVisualDataList(visualData: dailyReportVisuals, visualTitle: 'Date Shift\r\n');
      activeWorkers    = getVisualData(visualData: dailyReportVisuals, visualTitle: 'Active\r\n');
      inActiveWorkers  = getVisualData(visualData: dailyReportVisuals, visualTitle: 'Inactive\r\n');
      offLineWorkers   = getVisualData(visualData: dailyReportVisuals, visualTitle: 'Offline\r\n');
      activeVsExpected = getVisualData(visualData: dailyReportVisuals, visualTitle: 'Shift Hours Active,Expected Shift Hours\r\n');
      activeVsInactiveData = [
        GDPData('Active Hours', double.parse(activeVsExpected?.split(',').first??'0').toInt())
      ];
      totalWorkers     = getVisualData(visualData: dailyReportVisuals, visualTitle: 'Total Workers\r\n');
      if(selectedDate.isEmpty) {
        selectNewDate(dates.first);
      }
    });
  }

  void selectNewDate(String? newValue) {
    setState(() {
      selectedDate = newValue??'';
      _webViewController.evaluateJavascript(
          javascriptHandler.getOnVisualsDateChange(
              newValue??'',
              (newValue??'').replaceAll('00:00:00', '23:59:00'),
              selectedPage?.pageId??'',
              selectedPage?.pageVisuals?.where((element) => (element.visualData?.contains('Date Shift\r\n'))??false).toList().first.visualId??''
          )
      );
    });
  }
}

String getVisualData({required List<ReportPagesPageVisuals> visualData, required String visualTitle}) {
  try {
    ReportPagesPageVisuals visual = visualData.where((element) => element.visualData?.contains(visualTitle)??false).toList().first;
    return visual.visualData?.split('\r\n')[1]??'';
  } catch(e){
    return '';
  }
}

List<String> getVisualDataList({required List<ReportPagesPageVisuals> visualData, required String visualTitle}) {
  try {
    ReportPagesPageVisuals visual = visualData.where((element) => element.visualData?.contains(visualTitle)??false).toList().first;
    return (visual.visualData?.split('\r\n')??[])..remove(visualTitle);
  } catch(e){
    return [];
  }
}
const String _jsDebugChannel = 'DebugChannel';
const String _jsVisualDataChannel = 'VisualDataChannel';
const String reportsEndPoint = 'https://wakecapfn.azurewebsites.net/api/EmbedReport?code=u9/tUFCUp8RxUHpmFP5AdBTF1y79JjMr4Db8M65Yy3EyR6oVmy7Utg==&report=63533d2b-824a-4427-95f3-a3327c8ab6e8&group=3e3a5a50-c664-4507-a1e5-4c97611e73cc';


class GDPData {
  final String continent;
  final int gdp;

  GDPData(this.continent, this.gdp);
}
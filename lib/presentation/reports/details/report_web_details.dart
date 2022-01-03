import 'dart:convert';
import 'package:bower_bi/data/embed_report_entity.dart';
import 'package:bower_bi/data/report_pages_entity.dart';
import 'package:bower_bi/js/bundle_handler.dart';
import 'package:bower_bi/js/html_handler.dart';
import 'package:bower_bi/js/i_javascript_handler.dart';
import 'package:bower_bi/js/javascript_handler.dart';
import 'package:bower_bi/js/local_storage_handler.dart';
import 'package:bower_bi/js/web_view_service.dart';
import 'package:bower_bi/utils/custom_multiselect.dart';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:http/http.dart' as http;

class ReportWebDetailsScreen extends StatefulWidget {
  const ReportWebDetailsScreen({Key? key}) : super(key: key);

  @override
  _ReportWebDetailsScreenState createState() => _ReportWebDetailsScreenState();
}

class _ReportWebDetailsScreenState extends State<ReportWebDetailsScreen> {
  late WebViewController _webViewController;
  final IJavascriptHandler javascriptHandler = JavascriptHandler();
  late WebViewService _webViewService;
  String selectedValue = '';
  List<ReportPagesEntity> availablePages = [];
  ReportPagesEntity? selectedPage;
  List<ReportPagesPageVisuals> availableVisuals = [];


  bool isLoading = true;

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
            return snapshot.hasData ? Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    children: [
                      Expanded(
                        child: DropdownButtonFormField<ReportPagesEntity>(
                            value: selectedPage,
                            isExpanded: true,
                            decoration: const InputDecoration(
                              border: OutlineInputBorder(),
                            ),
                            onChanged: (newValue) {
                              setState(() {
                                selectedPage = newValue;
                                availableVisuals = selectedPage?.pageVisuals??[];
                                _webViewController.evaluateJavascript(
                                    javascriptHandler.getUpdateVisiblePage(selectedPage?.pageId??'')
                                );
                              });
                            },
                            items: availablePages.map(
                                    (ReportPagesEntity page) => DropdownMenuItem<ReportPagesEntity>(
                                    value: page,
                                    child: Text(page.pageName??'', overflow: TextOverflow.ellipsis,)
                                )
                            ).toList()
                        ),
                      ),
                      const SizedBox(width: 10,),
                      Expanded(
                        child: DropDownMultiSelect<ReportPagesPageVisuals>(
                          onChanged: (selectedValues){
                            for (var element in availableVisuals) {
                              element.isSelected = selectedValues.contains(element);
                              _webViewController.evaluateJavascript(
                                  javascriptHandler.getUpdatePageVisuals(selectedPage?.pageId??'', element.visualId??'', element.isSelected)
                              );
                            }
                            print("selected values: $selectedValues");
                          },
                          options: availableVisuals,
                          selectedValues: availableVisuals.where((element) => element.isSelected).toList(),
                          whenEmpty: 'Select Visual',
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
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
    });
  }

}

const String _jsDebugChannel = 'DebugChannel';
const String _jsVisualDataChannel = 'VisualDataChannel';

const String _jsErrorChannel = 'ErrorChannel';
const String _jsInteractChannel = 'InteractChannel';
const String _jsCreateChannel = 'CreateChannel';
const String _jsSelectChannel = 'SelectChannel';
const String _jsTranslateChannel = 'TranslateChannel';
const String _jsSliderChannel = 'SliderChannel';
const String _jsAnimationChannel = 'AnimationChannel';

const String reportsEndPoint = 'https://wakecapfn.azurewebsites.net/api/EmbedReport?code=u9/tUFCUp8RxUHpmFP5AdBTF1y79JjMr4Db8M65Yy3EyR6oVmy7Utg==&report=63533d2b-824a-4427-95f3-a3327c8ab6e8&group=3e3a5a50-c664-4507-a1e5-4c97611e73cc';

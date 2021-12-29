import 'dart:convert';

import 'package:bower_bi/js/bundle_handler.dart';
import 'package:bower_bi/js/html_handler.dart';
import 'package:bower_bi/js/i_javascript_handler.dart';
import 'package:bower_bi/js/javascript_handler.dart';
import 'package:bower_bi/js/local_storage_handler.dart';
import 'package:bower_bi/js/web_view_service.dart';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

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
  List<String> availableDates = [];
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
                DropdownButton<String>(
                  value: selectedValue,
                  onChanged: (newValue) {
                    setState(() {
                      selectedValue = newValue??'';
                    });
                  },
                  items: availableDates.map(
                    (e) => DropdownMenuItem<String>(
                        value: e,
                        child: Text(e)
                    )
                  ).toList()
                ),
                Expanded(
                  key: heightKey,
                  child: WebView(
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
                          var visualData = json.decode(msg.message);
                          List<String> dates = visualData["data"].split("\r\n");
                          setState(() {
                            availableDates = dates;
                          });
                          print(visualData);
                        }
                      )
                    },
                    onWebViewCreated:
                        (WebViewController webViewController) {
                      _webViewController = webViewController;
                    },
                    onPageFinished: (_) async {
                      await _webViewController.evaluateJavascript(javascriptHandler
                          .getTestCommunications());
                      final keyContext = heightKey.currentContext;
                      await _webViewController.evaluateJavascript(javascriptHandler
                          .getInitWebViewDimensionsFunction(keyContext!.size!.height));
                    },
                  ),
                ),
              ],
            ): const Center(child: CircularProgressIndicator());
          }
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () async {
            await _webViewController.evaluateJavascript(javascriptHandler
                .getVisualsData("ReportSectiondab2fb566641af96da92", "0d3836c206909c0ca001"));
          },
        ),
      ),
    );

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
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
      child: FutureBuilder(
        future: _webViewService.initWebViewUri(),
        builder: (context, snapshot) {
          return snapshot.hasData ? Column(
            children: [
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
    );

  }
}

const String _jsDebugChannel = 'DebugChannel';
const String _jsErrorChannel = 'ErrorChannel';
const String _jsInteractChannel = 'InteractChannel';
const String _jsCreateChannel = 'CreateChannel';
const String _jsSelectChannel = 'SelectChannel';
const String _jsTranslateChannel = 'TranslateChannel';
const String _jsSliderChannel = 'SliderChannel';
const String _jsAnimationChannel = 'AnimationChannel';
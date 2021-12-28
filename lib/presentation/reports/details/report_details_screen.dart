import 'package:flutter/material.dart';
import 'package:bower_bi/data/report_entity.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

class ReportDetailsScreen extends StatefulWidget {
  const ReportDetailsScreen({Key? key}) : super(key: key);

  @override
  _ReportDetailsScreenState createState() => _ReportDetailsScreenState();
}

class _ReportDetailsScreenState extends State<ReportDetailsScreen> {
  InAppWebViewController? webViewController;
  @override
  Widget build(BuildContext context) {
    ReportEntity report = ModalRoute.of(context)?.settings.arguments as ReportEntity;
    return Scaffold(
      body: SafeArea(
        child: InAppWebView(
          // key: webViewKey,
          initialUrlRequest:
          URLRequest(url: Uri.parse('${report.embedUrl}&autoAuth=true')),
          // initialOptions: options,
          // pullToRefreshController: pullToRefreshController,
          onWebViewCreated: (controller) {
            webViewController = controller;
          },
          onLoadStart: (controller, url) {
            setState(() {

            });
          },
          androidOnPermissionRequest: (controller, origin, resources) async {
            return PermissionRequestResponse(
                resources: resources,
                action: PermissionRequestResponseAction.GRANT);
          },
        ),
      ),
    );
  }
}

import 'dart:convert';
import 'package:bower_bi/main.dart';
import 'package:bower_bi/presentation/reports/details/report_details_screen.dart';
import 'package:bower_bi/presentation/reports/analytics/analytics_screen.dart';
import 'package:flutter/material.dart';
import 'package:bower_bi/data/report_entity.dart';
import 'package:http/http.dart' as http;

class ReportsListScreen extends StatefulWidget {
  const ReportsListScreen({Key? key}) : super(key: key);

  @override
  _ReportsListScreenState createState() => _ReportsListScreenState();
}

class _ReportsListScreenState extends State<ReportsListScreen> {
  bool isLoading = false;
  List<ReportEntity> reports = [];


  @override
  void initState() {
    super.initState();
    _getReports();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Power Bi Demo"),
      ),
      body: isLoading?
      const Center(child: CircularProgressIndicator()):
      ListView.builder(
          itemCount: reports.length,
          itemBuilder: (context, index) {
            ReportEntity report = reports[index];
            return Card(
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8)
              ),
              child: ListTile(
                title: Text(report.name??''),
                onTap: (){
                  Navigator.of(context).push(MaterialPageRoute(builder: (ctx) => const AnalyticsScreen(), settings: RouteSettings(arguments: report)));
                },
              ),
            );
          }
      ),
    );
  }
  void _getReports() {
    setState(() {
      isLoading = true;
    });
    http.post(
      Uri.parse(authEndPoint),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      encoding: Encoding.getByName('utf-8'),
      body: {
        'client_id': clientId,
        'grant_type':'password',
        'resource':'https://analysis.windows.net/powerbi/api',
        'username':userName,
        'password':password
      }
    ).then((response){
      print("auth response code: ${response.statusCode}");
      print("auth response body: ${response.body}");
      token = json.decode(response.body)['access_token'];
      http.get(Uri.parse(reportsEndPoint), headers: {"Authorization":"Bearer $token"})
          .then((response){
        print("response code: ${response.statusCode}");
        print("response body: ${response.body}");
        reports = List.from(json.decode(response.body)['value']).map((e) => ReportEntity().fromJson(e)).toList();
        print("reports length: ${reports.length}");
        setState(() {isLoading = false;});
      });
    });
  }
}
const String authEndPoint = 'https://login.windows.net/common/oauth2/token';
const String reportsEndPoint = 'https://api.powerbi.com/v1.0/myorg/reports';
const String clientId = '626faf77-f356-4b6e-befb-bfa3d4894efa';
const String userName = 'a.hazem@nousdigital.net';
const String password = '@boh@n@126';


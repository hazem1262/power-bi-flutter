import 'package:bower_bi/generated/json/base/json_convert_content.dart';

class ReportEntity with JsonConvert<ReportEntity> {
	String? id;
	String? reportType;
	String? name;
	String? webUrl;
	String? embedUrl;
	bool? isOwnedByMe;
	String? datasetId;
	List<dynamic>? users;
	List<dynamic>? subscriptions;
}

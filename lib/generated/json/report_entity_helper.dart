import 'package:bower_bi/data/report_entity.dart';

reportEntityFromJson(ReportEntity data, Map<String, dynamic> json) {
	if (json['id'] != null) {
		data.id = json['id'].toString();
	}
	if (json['reportType'] != null) {
		data.reportType = json['reportType'].toString();
	}
	if (json['name'] != null) {
		data.name = json['name'].toString();
	}
	if (json['webUrl'] != null) {
		data.webUrl = json['webUrl'].toString();
	}
	if (json['embedUrl'] != null) {
		data.embedUrl = json['embedUrl'].toString();
	}
	if (json['isOwnedByMe'] != null) {
		data.isOwnedByMe = json['isOwnedByMe'];
	}
	if (json['datasetId'] != null) {
		data.datasetId = json['datasetId'].toString();
	}
	if (json['users'] != null) {
		data.users = (json['users'] as List).map((v) => v).toList().cast<dynamic>();
	}
	if (json['subscriptions'] != null) {
		data.subscriptions = (json['subscriptions'] as List).map((v) => v).toList().cast<dynamic>();
	}
	return data;
}

Map<String, dynamic> reportEntityToJson(ReportEntity entity) {
	final Map<String, dynamic> data = new Map<String, dynamic>();
	data['id'] = entity.id;
	data['reportType'] = entity.reportType;
	data['name'] = entity.name;
	data['webUrl'] = entity.webUrl;
	data['embedUrl'] = entity.embedUrl;
	data['isOwnedByMe'] = entity.isOwnedByMe;
	data['datasetId'] = entity.datasetId;
	data['users'] = entity.users;
	data['subscriptions'] = entity.subscriptions;
	return data;
}
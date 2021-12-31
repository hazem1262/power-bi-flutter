import 'package:bower_bi/data/report_pages_entity.dart';

reportPagesEntityFromJson(ReportPagesEntity data, Map<String, dynamic> json) {
	if (json['pageId'] != null) {
		data.pageId = json['pageId'].toString();
	}
	if (json['pageName'] != null) {
		data.pageName = json['pageName'].toString();
	}
	if (json['pageVisuals'] != null) {
		data.pageVisuals = (json['pageVisuals'] as List).map((v) => ReportPagesPageVisuals().fromJson(v)).toList();
	}
	return data;
}

Map<String, dynamic> reportPagesEntityToJson(ReportPagesEntity entity) {
	final Map<String, dynamic> data = new Map<String, dynamic>();
	data['pageId'] = entity.pageId;
	data['pageName'] = entity.pageName;
	data['pageVisuals'] =  entity.pageVisuals?.map((v) => v.toJson())?.toList();
	return data;
}

reportPagesPageVisualsFromJson(ReportPagesPageVisuals data, Map<String, dynamic> json) {
	if (json['visualId'] != null) {
		data.visualId = json['visualId'].toString();
	}
	if (json['visualName'] != null) {
		data.visualName = json['visualName'].toString();
	}
	if (json['visualData'] != null) {
		data.visualData = json['visualData'].toString();
	}
	return data;
}

Map<String, dynamic> reportPagesPageVisualsToJson(ReportPagesPageVisuals entity) {
	final Map<String, dynamic> data = new Map<String, dynamic>();
	data['visualId'] = entity.visualId;
	data['visualName'] = entity.visualName;
	data['visualData'] = entity.visualData;
	return data;
}
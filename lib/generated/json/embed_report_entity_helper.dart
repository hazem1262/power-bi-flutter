import 'package:bower_bi/data/embed_report_entity.dart';

embedReportEntityFromJson(EmbedReportEntity data, Map<String, dynamic> json) {
	if (json['Type'] != null) {
		data.type = json['Type'].toString();
	}
	if (json['EmbedReport'] != null) {
		data.embedReport = (json['EmbedReport'] as List).map((v) => EmbedReportEmbedReport().fromJson(v)).toList();
	}
	if (json['EmbedToken'] != null) {
		data.embedToken = EmbedReportEmbedToken().fromJson(json['EmbedToken']);
	}
	return data;
}

Map<String, dynamic> embedReportEntityToJson(EmbedReportEntity entity) {
	final Map<String, dynamic> data = new Map<String, dynamic>();
	data['Type'] = entity.type;
	data['EmbedReport'] =  entity.embedReport?.map((v) => v.toJson())?.toList();
	data['EmbedToken'] = entity.embedToken?.toJson();
	return data;
}

embedReportEmbedReportFromJson(EmbedReportEmbedReport data, Map<String, dynamic> json) {
	if (json['ReportId'] != null) {
		data.reportId = json['ReportId'].toString();
	}
	if (json['ReportName'] != null) {
		data.reportName = json['ReportName'].toString();
	}
	if (json['EmbedUrl'] != null) {
		data.embedUrl = json['EmbedUrl'].toString();
	}
	return data;
}

Map<String, dynamic> embedReportEmbedReportToJson(EmbedReportEmbedReport entity) {
	final Map<String, dynamic> data = new Map<String, dynamic>();
	data['ReportId'] = entity.reportId;
	data['ReportName'] = entity.reportName;
	data['EmbedUrl'] = entity.embedUrl;
	return data;
}

embedReportEmbedTokenFromJson(EmbedReportEmbedToken data, Map<String, dynamic> json) {
	if (json['token'] != null) {
		data.token = json['token'].toString();
	}
	if (json['tokenId'] != null) {
		data.tokenId = json['tokenId'].toString();
	}
	if (json['expiration'] != null) {
		data.expiration = json['expiration'].toString();
	}
	return data;
}

Map<String, dynamic> embedReportEmbedTokenToJson(EmbedReportEmbedToken entity) {
	final Map<String, dynamic> data = new Map<String, dynamic>();
	data['token'] = entity.token;
	data['tokenId'] = entity.tokenId;
	data['expiration'] = entity.expiration;
	return data;
}
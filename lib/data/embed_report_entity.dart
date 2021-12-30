import 'package:bower_bi/generated/json/base/json_convert_content.dart';
import 'package:bower_bi/generated/json/base/json_field.dart';

class EmbedReportEntity with JsonConvert<EmbedReportEntity> {
	@JSONField(name: "Type")
	String? type;
	@JSONField(name: "EmbedReport")
	List<EmbedReportEmbedReport>? embedReport;
	@JSONField(name: "EmbedToken")
	EmbedReportEmbedToken? embedToken;
}

class EmbedReportEmbedReport with JsonConvert<EmbedReportEmbedReport> {
	@JSONField(name: "ReportId")
	String? reportId;
	@JSONField(name: "ReportName")
	String? reportName;
	@JSONField(name: "EmbedUrl")
	String? embedUrl;
}

class EmbedReportEmbedToken with JsonConvert<EmbedReportEmbedToken> {
	String? token;
	String? tokenId;
	String? expiration;
}

import 'package:bower_bi/generated/json/base/json_convert_content.dart';

class ReportPagesEntity with JsonConvert<ReportPagesEntity> {
	String? pageId;
	String? pageName;
	List<ReportPagesPageVisuals>? pageVisuals;
}

class ReportPagesPageVisuals with JsonConvert<ReportPagesPageVisuals> {
	String? visualId;
	String? visualName;
	String? visualData;

	bool isSelected = true;
}

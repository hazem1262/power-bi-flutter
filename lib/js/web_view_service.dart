import 'package:bower_bi/js/i_bundle_handler.dart';
import 'package:bower_bi/js/i_html_handler.dart';
import 'package:bower_bi/js/i_local_storage_handler.dart';
const String _projectAssetsPath = 'assets';
const String _projectJsPath = 'js';
const String _jsFileExtension = 'js';
const String _htmlFileExtension = 'html';
const String _logicFileName = 'logic';
const String _powerBiFileName = 'powerbi';
const String _jQueryFileName = 'jquery';
const String _htmlFileName = 'index';
const String _uriScheme = 'file';

class WebViewService {
  WebViewService({
    required ILocalStorageHandler localStorageHandler,
    required IBundleHandler bundleHandler,
    required IHtmlHandler htmlHandler,
  })  : _localStorageHandler = localStorageHandler,
        _bundleHandler = bundleHandler,
        _htmlHandler = htmlHandler;

  final ILocalStorageHandler _localStorageHandler;
  final IBundleHandler _bundleHandler;
  final IHtmlHandler _htmlHandler;
  late Uri _uri;

  Future<String> initWebViewUri() async {
    _uri = Uri(
        scheme: _uriScheme,
        path: await _prepareWebViewUriPath());
    return _uri.path;
  }

  Future<String> _prepareWebViewUriPath() async {
    final String _tempDir = await _localStorageHandler.getTemporaryPath();

    final String _tempHtmlPath = '$_tempDir/$_htmlFileName.$_htmlFileExtension';
    final String _tempPowerBiJsPath = '$_tempDir/$_powerBiFileName.$_jsFileExtension';
    final String _tempLogicJsPath = '$_tempDir/$_logicFileName.$_jsFileExtension';
    final String _tempJQueryJsPath = '$_tempDir/$_jQueryFileName.$_jsFileExtension';

    final String _projectHtmlFile = _htmlHandler.getIndexFile(_tempPowerBiJsPath, _tempLogicJsPath, _tempJQueryJsPath);
    _localStorageHandler.writeStringToLocalStorage(
        _tempHtmlPath, _projectHtmlFile);

    _localStorageHandler.writeStringToLocalStorage(
        _tempLogicJsPath,
        await _bundleHandler.loadString(
            '$_projectAssetsPath/$_projectJsPath/$_logicFileName.$_jsFileExtension')
    );
    _localStorageHandler.writeStringToLocalStorage(
        _tempPowerBiJsPath,
        await _bundleHandler.loadString(
            '$_projectAssetsPath/$_projectJsPath/$_powerBiFileName.$_jsFileExtension')
    );
    _localStorageHandler.writeStringToLocalStorage(
        _tempJQueryJsPath,
        await _bundleHandler.loadString(
            '$_projectAssetsPath/$_projectJsPath/$_jQueryFileName.$_jsFileExtension')
    );

    return _tempHtmlPath;
  }

  Uri get uri => _uri;
}

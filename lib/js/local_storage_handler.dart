import 'dart:io';
import 'dart:typed_data';
import 'package:bower_bi/js/i_local_storage_handler.dart';
import 'package:path_provider/path_provider.dart';

class LocalStorageHandler implements ILocalStorageHandler {
  @override
  void writeBytesToLocalStorage(String path, Uint8List file) {
    File(path).writeAsBytesSync(file);
  }

  @override
  void writeStringToLocalStorage(String path, String file) {
    File(path).writeAsStringSync(file);
  }

  @override
  Future<String> getTemporaryPath() async {
    return (await getTemporaryDirectory()).path;
  }
}

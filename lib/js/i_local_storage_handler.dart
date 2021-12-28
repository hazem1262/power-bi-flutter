import 'dart:typed_data';

abstract class ILocalStorageHandler {
  void writeBytesToLocalStorage(String path, Uint8List file);
  void writeStringToLocalStorage(String path, String file);
  Future<String> getTemporaryPath();
}

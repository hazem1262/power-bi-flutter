import 'package:flutter/services.dart';

abstract class IBundleHandler {
  Future<String> loadString(String path);
  Future<ByteData> loadByteData(String path);
}

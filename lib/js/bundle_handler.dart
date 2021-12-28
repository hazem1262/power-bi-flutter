import 'dart:typed_data';
import 'package:bower_bi/js/i_bundle_handler.dart';
import 'package:flutter/services.dart';

class BundleHandler implements IBundleHandler {
  @override
  Future<ByteData> loadByteData(String path) async {
    return rootBundle.load(path);
  }

  @override
  Future<String> loadString(String path) async {
    return rootBundle.loadString(path);
  }
}

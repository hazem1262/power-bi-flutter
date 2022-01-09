library multiselect;

import 'package:flutter/material.dart';
import 'package:states_rebuilder/states_rebuilder.dart';

class _TheState {}

var _theState = RM.inject(() => _TheState());

class _SelectRow extends StatelessWidget {
  final Function(bool) onChange;
  final bool selected;
  final String text;

  const _SelectRow(
      {Key? key,
      required this.onChange,
      required this.selected,
      required this.text})
      : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Checkbox(
            value: selected,
            onChanged: (x) {
              onChange(x!);
              _theState.notify();
            }),
        Expanded(child: Text(text, overflow: TextOverflow.ellipsis))
      ],
    );
  }
}

///
/// A Dropdown multiselect menu
///
///
class DropDownMultiSelect<T> extends StatefulWidget {
  /// The options form which a user can select
  final List<T> options;

  /// Selected Values
  final List<T> selectedValues;

  /// This function is called whenever a value changes
  final Function(List<T>) onChanged;

  /// defines whether the field is dense
  final bool isDense;

  /// defines whether the widget is enabled;
  final bool enabled;

  /// Input decoration
  final InputDecoration? decoration;

  /// this text is shown when there is no selection
  final String? whenEmpty;

  /// a function to build custom childern
  final Widget Function(List<T> selectedValues)? childBuilder;

  /// a function to build custom menu items
  final Widget Function(T option)? menuItembuilder;

  const DropDownMultiSelect({
    Key? key,
    required this.options,
    required this.selectedValues,
    required this.onChanged,
    required this.whenEmpty,
    this.childBuilder,
    this.menuItembuilder,
    this.isDense = false,
    this.enabled = true,
    this.decoration,
  }) : super(key: key);
  @override
  _DropDownMultiSelectState createState() => _DropDownMultiSelectState<T>();
}

class _DropDownMultiSelectState<T> extends State<DropDownMultiSelect<T>> {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 100,
      child: Stack(
        children: [
          _theState.rebuilder(() => widget.childBuilder != null
              ? widget.childBuilder!(widget.selectedValues)
              : const Align(
                  child: Padding(
                      padding:
                          EdgeInsets.symmetric(vertical: 20, horizontal: 10),
                      child: Text('Choose Visuals')),
                  alignment: Alignment.centerLeft)),
          Align(
            alignment: Alignment.centerLeft,
            child: DropdownButtonFormField<T>(
              decoration: widget.decoration ?? const InputDecoration(
                      border: OutlineInputBorder(),
                      isDense: true,
                      contentPadding: EdgeInsets.symmetric(
                        vertical: 20,
                        horizontal: 10,
                      ),
                    ),
              isDense: true,
              onChanged: widget.enabled ? (x) {} : null,
              value: null,
              selectedItemBuilder: (context) {
                return widget.options
                    .map((e) => DropdownMenuItem(
                          child: Container(),
                        ))
                    .toList();
              },
              items: widget.options
                  .map((x) => DropdownMenuItem(
                        child: _theState.rebuilder(() {
                          return widget.menuItembuilder != null
                              ? widget.menuItembuilder!(x)
                              : _SelectRow(
                                  selected: widget.selectedValues.contains(x),
                                  text: x.toString(),
                                  onChange: (isSelected) {
                                    if (isSelected) {
                                      var ns = widget.selectedValues;
                                      ns.add(x);
                                      widget.onChanged(ns);
                                    } else {
                                      var ns = widget.selectedValues;
                                      ns.remove(x);
                                      widget.onChanged(ns);
                                    }
                                  },
                                );
                        }),
                        value: x,
                        onTap: () {
                          if (widget.selectedValues.contains(x)) {
                            var ns = widget.selectedValues;
                            ns.remove(x);
                            widget.onChanged(ns);
                          } else {
                            var ns = widget.selectedValues;
                            ns.add(x);
                            widget.onChanged(ns);
                          }
                        },
                      ))
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }
}

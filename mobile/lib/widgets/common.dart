import 'dart:ui' show ImageFilter;
import 'package:flutter/material.dart';
import '../models/models.dart';
import '../theme.dart';

/// Small, reusable, decoupled UI atoms shared across feature screens.

/// A pill showing a dataset's confidentiality classification.
class ClassBadge extends StatelessWidget {
  final Classification classification;
  final bool dense;
  const ClassBadge(this.classification, {super.key, this.dense = false});

  @override
  Widget build(BuildContext context) {
    final c = classification.color;
    return Container(
      padding: EdgeInsets.symmetric(horizontal: dense ? 8 : 10, vertical: 4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.fromBorderSide(BorderSide(color: c)),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Icon(Icons.circle, size: 6, color: c),
        const SizedBox(width: 6),
        Text(classification.label.toUpperCase(),
            style: TextStyle(
                color: c,
                fontSize: 9.5,
                letterSpacing: 0.8,
                fontWeight: FontWeight.w600)),
      ]),
    );
  }
}

class SectionHeader extends StatelessWidget {
  final String kicker;
  final String title;
  final String? subtitle;
  const SectionHeader(
      {super.key, required this.kicker, required this.title, this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(kicker.toUpperCase(),
            style: const TextStyle(
                color: AppColors.saffron,
                fontSize: 11,
                letterSpacing: 2.4,
                fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        Text(title, style: AppTheme.display(26)),
        if (subtitle != null) ...[
          const SizedBox(height: 8),
          Text(subtitle!,
              style: const TextStyle(color: AppColors.muted, height: 1.5)),
        ],
      ],
    );
  }
}

/// A premium glass-ish card with a colored top accent bar.
class GlassCard extends StatelessWidget {
  final Widget child;
  final Color accent;
  final EdgeInsets padding;
  final VoidCallback? onTap;
  const GlassCard(
      {super.key,
      required this.child,
      this.accent = AppColors.gold,
      this.padding = const EdgeInsets.all(18),
      this.onTap});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
        child: Material(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(16),
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                border: const Border.fromBorderSide(
                    BorderSide(color: AppColors.line)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Container(
                      height: 3,
                      decoration: BoxDecoration(
                          color: accent,
                          borderRadius: const BorderRadius.vertical(
                              top: Radius.circular(16)))),
                  Padding(padding: padding, child: child),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class LivePill extends StatelessWidget {
  const LivePill({super.key});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.green.withValues(alpha: 0.14),
        borderRadius: BorderRadius.circular(20),
      ),
      child: const Row(mainAxisSize: MainAxisSize.min, children: [
        Icon(Icons.circle, size: 7, color: AppColors.green),
        SizedBox(width: 6),
        Text('LIVE',
            style: TextStyle(
                color: AppColors.green,
                fontSize: 9,
                letterSpacing: 1.4,
                fontWeight: FontWeight.w700)),
      ]),
    );
  }
}

class Tag extends StatelessWidget {
  final String label;
  const Tag(this.label, {super.key});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.04),
        borderRadius: BorderRadius.circular(20),
        border: const Border.fromBorderSide(BorderSide(color: AppColors.line)),
      ),
      child: Text(label,
          style: const TextStyle(fontSize: 11, color: AppColors.text)),
    );
  }
}

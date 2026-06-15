import 'package:flutter/material.dart';
import '../../data/repository.dart';
import '../../theme.dart';
import '../../widgets/common.dart';

/// Futures 2040 — the forward-looking capability roadmap for the digital city.
/// Rendered as a vertical timeline grouped by horizon year.
class FuturesScreen extends StatelessWidget {
  final AmaraverseRepository repo;
  const FuturesScreen({super.key, required this.repo});

  @override
  Widget build(BuildContext context) {
    final items = repo.futures();
    return CustomScrollView(slivers: [
      const SliverToBoxAdapter(
        child: Padding(
          padding: EdgeInsets.fromLTRB(20, 64, 20, 16),
          child: SectionHeader(
            kicker: 'Futures · the city of 2040',
            title: 'Designed for what comes next',
            subtitle:
                'A sequenced roadmap of the digital capabilities data.amaravati is built to grow into.',
          ),
        ),
      ),
      SliverPadding(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 30),
        sliver: SliverList(
          delegate: SliverChildBuilderDelegate(
            (_, i) {
              final f = items[i];
              final isLast = i == items.length - 1;
              return IntrinsicHeight(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // timeline rail
                    Column(children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: f.accent.withValues(alpha: 0.16),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(f.horizon,
                            style: TextStyle(
                                color: f.accent,
                                fontWeight: FontWeight.w700,
                                fontSize: 12)),
                      ),
                      if (!isLast)
                        Expanded(
                            child: Container(
                                width: 2,
                                margin: const EdgeInsets.symmetric(vertical: 6),
                                color: AppColors.line)),
                    ]),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 14),
                        child: GlassCard(
                          accent: f.accent,
                          child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Icon(f.icon, color: f.accent),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(f.title,
                                            style: const TextStyle(
                                                fontWeight: FontWeight.w600,
                                                fontSize: 15)),
                                        const SizedBox(height: 5),
                                        Text(f.description,
                                            style: const TextStyle(
                                                color: AppColors.muted,
                                                fontSize: 13,
                                                height: 1.45)),
                                      ]),
                                ),
                              ]),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
            childCount: items.length,
          ),
        ),
      ),
    ]);
  }
}

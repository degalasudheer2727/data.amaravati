import 'package:flutter/material.dart';
import '../../data/repository.dart';
import '../../theme.dart';
import '../../widgets/common.dart';

class HomeScreen extends StatelessWidget {
  final AmaraverseRepository repo;
  const HomeScreen({super.key, required this.repo});

  @override
  Widget build(BuildContext context) {
    final kpis = repo.kpis();
    final signals = repo.liveSignals();
    final pillars = repo.pillars();

    return CustomScrollView(
      slivers: [
        SliverToBoxAdapter(
          child: Container(
            padding: const EdgeInsets.fromLTRB(20, 64, 20, 28),
            decoration: const BoxDecoration(
              gradient: RadialGradient(
                center: Alignment(0.6, -0.8),
                radius: 1.1,
                colors: [Color(0x26FF9F43), AppColors.bg],
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(children: [
                  Text('Live Twin · Amaravati',
                      style: TextStyle(
                          color: AppColors.saffron,
                          fontSize: 11,
                          letterSpacing: 2.2,
                          fontWeight: FontWeight.w600)),
                  Spacer(),
                  LivePill(),
                ]),
                const SizedBox(height: 14),
                Text('The People’s Capital,\nin your pocket.',
                    style: AppTheme.display(30)),
                const SizedBox(height: 8),
                Text('అమరావతి', style: AppTheme.telugu(16)),
                const SizedBox(height: 14),
                const Text(
                  'A navigable digital twin and open-data nexus for the Amaravati master plan — every domain of the city as a live connector.',
                  style: TextStyle(color: AppColors.muted, height: 1.5),
                ),
              ],
            ),
          ),
        ),

        // KPI grid
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 4, 20, 8),
          sliver: SliverGrid(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 1.7),
            delegate: SliverChildBuilderDelegate(
              (_, i) {
                final k = kpis[i];
                return GlassCard(
                  accent: AppColors.gold,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      RichText(
                          text: TextSpan(children: [
                        TextSpan(
                            text: k.value,
                            style: AppTheme.display(28, color: AppColors.gold)),
                        TextSpan(
                            text: k.unit,
                            style:
                                AppTheme.display(15, color: AppColors.saffron)),
                      ])),
                      const SizedBox(height: 6),
                      Text(k.label.toUpperCase(),
                          style: const TextStyle(
                              color: AppColors.muted,
                              fontSize: 10,
                              letterSpacing: 0.6)),
                    ],
                  ),
                );
              },
              childCount: kpis.length,
            ),
          ),
        ),

        // Live signals
        const SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsets.fromLTRB(20, 16, 20, 8),
            child: SectionHeader(
                kicker: 'Live signals', title: 'The city, right now'),
          ),
        ),
        SliverToBoxAdapter(
          child: SizedBox(
            height: 104,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: signals.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (_, i) {
                final s = signals[i];
                return Container(
                  width: 150,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(14),
                    border: const Border.fromBorderSide(
                        BorderSide(color: AppColors.line)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(s.label,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                              color: AppColors.muted, fontSize: 11)),
                      Text(s.value,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppTheme.display(18, color: AppColors.text)),
                    ],
                  ),
                );
              },
            ),
          ),
        ),

        // Pillars
        const SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsets.fromLTRB(20, 24, 20, 8),
            child: SectionHeader(
                kicker: 'The four pillars',
                title: 'A national-grade nexus',
                subtitle:
                    'Turning a master plan into a public, governed, intelligent data utility.'),
          ),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 28),
          sliver: SliverList(
            delegate: SliverChildBuilderDelegate(
              (_, i) {
                final p = pillars[i];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: GlassCard(
                    accent: p.accent,
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(p.number,
                            style: AppTheme.display(26, color: p.accent)),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(p.title,
                                    style: const TextStyle(
                                        fontWeight: FontWeight.w600,
                                        fontSize: 15)),
                                const SizedBox(height: 4),
                                Text(p.description,
                                    style: const TextStyle(
                                        color: AppColors.muted,
                                        fontSize: 13,
                                        height: 1.45)),
                              ]),
                        ),
                      ],
                    ),
                  ),
                );
              },
              childCount: pillars.length,
            ),
          ),
        ),
      ],
    );
  }
}

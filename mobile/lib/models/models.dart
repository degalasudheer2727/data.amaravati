import 'package:flutter/material.dart';

/// Immutable domain models for data.amaravati. Pure data — no UI, no IO.
/// Keeping these decoupled lets the repository swap mock data for a real
/// open-data API later without touching the feature screens.

/// Confidentiality tier a dataset is classified under. The tier — not the
/// team — decides the path to access and the controls applied.
enum Classification { public, internal, restricted, confidential }

/// How a persona may reach a given classification tier.
enum Access {
  instant, // open / direct use
  agreement, // needs a data-sharing agreement + purpose review
  closed, // not available to this persona
}

extension ClassificationMeta on Classification {
  String get label => switch (this) {
        Classification.public => 'Public',
        Classification.internal => 'Internal',
        Classification.restricted => 'Restricted',
        Classification.confidential => 'Confidential',
      };
  String get level => switch (this) {
        Classification.public => 'P0 · Open',
        Classification.internal => 'P1 · Internal',
        Classification.restricted => 'P2 · Restricted',
        Classification.confidential => 'P3 · Confidential',
      };
  // 3-colour system: saffron / snow / muted-snow, differentiated by weight.
  Color get color => switch (this) {
        Classification.public => const Color(0xFFFF9F43),
        Classification.internal => const Color(0xFFEEF2F8),
        Classification.restricted => const Color(0xB8FF9F43),
        Classification.confidential => const Color(0x73EEF2F8),
      };
}

@immutable
class ClassTier {
  final Classification kind;
  final String telugu;
  final String description;
  final String path;
  const ClassTier(this.kind, this.telugu, this.description, this.path);
}

@immutable
class Persona {
  final String key;
  final String title;
  final String telugu;
  final String description;
  final IconData icon;

  /// Access envelope across the four confidentiality tiers.
  final Map<Classification, Access> access;
  const Persona({
    required this.key,
    required this.title,
    required this.telugu,
    required this.description,
    required this.icon,
    required this.access,
  });

  Access accessFor(Classification c) => access[c] ?? Access.closed;
}

@immutable
class Dataset {
  final String entity;
  final String title;
  final String description;
  final String format;
  final String cadence;
  final String owner;
  final Classification classification;
  const Dataset({
    required this.entity,
    required this.title,
    required this.description,
    required this.format,
    required this.cadence,
    required this.owner,
    required this.classification,
  });
}

/// Status of an inter-agency exchange agreement in CRDA governance.
enum ExchangeStatus { active, review, agreement, declined }

extension ExchangeStatusMeta on ExchangeStatus {
  String get label => switch (this) {
        ExchangeStatus.active => 'Active',
        ExchangeStatus.review => 'CRDA review',
        ExchangeStatus.agreement => 'Agreement',
        ExchangeStatus.declined => 'Declined',
      };
  Color get color => switch (this) {
        ExchangeStatus.active => const Color(0xFFFF9F43),
        ExchangeStatus.review => const Color(0xFFEEF2F8),
        ExchangeStatus.agreement => const Color(0xB8FF9F43),
        ExchangeStatus.declined => const Color(0x6BEEF2F8),
      };
}

/// A government entity participating in the Data Exchange Hub.
@immutable
class GovEntity {
  final String abbr;
  final String name;
  final String role;
  final IconData icon;
  final int published;
  final int consumed;
  final Color color;
  final bool governs; // true for CRDA, the governing authority
  const GovEntity({
    required this.abbr,
    required this.name,
    required this.role,
    required this.icon,
    required this.published,
    required this.consumed,
    required this.color,
    this.governs = false,
  });
}

/// A step in the CRDA-governed exchange workflow.
@immutable
class ExchangeStep {
  final String number;
  final String title;
  final String description;
  final bool crda; // governed/controlled by CRDA
  const ExchangeStep(this.number, this.title, this.description,
      {this.crda = false});
}

/// A government-to-government exchange agreement in the register.
@immutable
class ExchangeRecord {
  final String provider;
  final String consumer;
  final String dataset;
  final Classification classification;
  final ExchangeStatus status;
  final String purpose;
  const ExchangeRecord({
    required this.provider,
    required this.consumer,
    required this.dataset,
    required this.classification,
    required this.status,
    required this.purpose,
  });
}

/// A signed-in user mapped to a persona. `null` persona until chosen.
@immutable
class AppUser {
  final String name;
  final String email;
  final String? photoUrl;
  final String personaKey;
  const AppUser({
    required this.name,
    required this.email,
    this.photoUrl,
    this.personaKey = 'citizen',
  });

  AppUser copyWith({String? personaKey}) => AppUser(
        name: name,
        email: email,
        photoUrl: photoUrl,
        personaKey: personaKey ?? this.personaKey,
      );
}

@immutable
class Kpi {
  final String value;
  final String unit;
  final String label;
  const Kpi(this.value, this.unit, this.label);
}

@immutable
class Pillar {
  final String number;
  final String title;
  final String description;
  final Color accent;
  const Pillar(this.number, this.title, this.description, this.accent);
}

@immutable
class Connector {
  final String entity;
  final String title;
  final String description;
  final IconData icon;
  final List<String> feeds;
  final Color accent;
  final double reading; // 0..1 indicative live value for the gauge
  const Connector({
    required this.entity,
    required this.title,
    required this.description,
    required this.icon,
    required this.feeds,
    required this.accent,
    this.reading = 0.7,
  });
}

@immutable
class ThemeCity {
  final String title;
  final String telugu;
  final String description;
  final Color color;
  final int datasets;
  const ThemeCity(
      this.title, this.telugu, this.description, this.color, this.datasets);
}

@immutable
class FutureFeature {
  final String horizon; // e.g. "2030", "2035", "2040"
  final String title;
  final String description;
  final IconData icon;
  final Color accent;
  const FutureFeature({
    required this.horizon,
    required this.title,
    required this.description,
    required this.icon,
    required this.accent,
  });
}

@immutable
class Signal {
  final String label;
  final String value;
  const Signal(this.label, this.value);
}

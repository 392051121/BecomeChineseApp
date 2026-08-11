/**
 * Privacy Policy Screen
 *
 * Local-only privacy policy for a fully offline app.
 * This app collects NO personal data, has no network upload,
 * no accounts, no analytics, no ads, and no third-party SDKs.
 * The policy is shown in-app (Store accepted form) AND covers
 * the iOS PrivacyInfo / Android Data Safety form declarations.
 */

import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionCard } from '../components/SectionCard';

function PolicySection({ title, titleZh, children, color }) {
  const { colors } = useTheme();
  return (
    <SectionCard style={styles.section} tone="soft">
      <Text style={[styles.sectionKicker, { color }]}>{titleZh}</Text>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <View style={styles.sectionBody}>
        {React.Children.map(children, (child) => child)}
      </View>
    </SectionCard>
  );
}

function PolicyText({ children }) {
  const { colors } = useTheme();
  return <Text style={[styles.bodyText, { color: colors.text }]}>{children}</Text>;
}

function PolicyBullet({ children }) {
  const { colors } = useTheme();
  return (
    <View style={styles.bulletRow}>
      <Text style={[styles.bulletDot, { color: theme.colors.primary }]}>•</Text>
      <Text style={[styles.bulletText, { color: colors.text }]}>{children}</Text>
    </View>
  );
}

export function PrivacyPolicyScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          kicker="Legal"
          title="Privacy Policy"
          titleZh="隐私政策"
          subtitle="Effective date: August 2026 · Last updated: August 2026"
          style={styles.header}
        />

        <View style={[styles.updatedBadge, { backgroundColor: colors.softCard }]}>
          <Text style={[styles.updatedText, { color: colors.mutedText }]}>
            本应用完全离线运行，不上传、不收集任何个人信息。
          </Text>
        </View>

        <PolicySection title="1. We Collect Nothing" titleZh="一、我们不收集任何数据">
          <PolicyText>
            {`Become Chinese is a fully offline, local-only application. All content — solar terms,
            travel, food, history, collections, and your learning progress — is stored entirely on
            your device. We do not collect, transmit, sell, or share any personal information.`}
          </PolicyText>
        </PolicySection>

        <PolicySection title="2. No Accounts, No Tracking" titleZh="二、无账户、无追踪">
          <PolicyText>{`There is no account system, no login, no registration, and no user profiling.`}</PolicyText>
          <PolicyBullet>{'No analytics or crash-reporting SDKs.'}</PolicyBullet>
          <PolicyBullet>{'No advertising or third-party ad networks.'}</PolicyBullet>
          <PolicyBullet>{'No tracking cookies, identifiers, or fingerprinting.'}</PolicyBullet>
        </PolicySection>

        <PolicySection title="3. No Network Usage" titleZh="三、无需联网">
          <PolicyText>
            {`The app does not require an internet connection and makes no network requests.
            The only network capability is a local connectivity check, which never leaves your device.`}
          </PolicyText>
        </PolicySection>

        <PolicySection title="4. Permissions & Device Data" titleZh="四、权限与设备数据">
          <PolicyText>
            {`We do not request access to your camera, microphone, location, contacts, or photos.
            No device identifiers are collected or transmitted. Your data stays on your device.`}
          </PolicyText>
        </PolicySection>

        <PolicySection title="5. Local Storage" titleZh="五、本地存储">
          <PolicyText>
            {`Your favorites, badges, name collection, and progress are saved on your device only.
            You can clear this data at any time by deleting the app or clearing app storage.
            We have no way to access this data remotely.`}
          </PolicyText>
        </PolicySection>

        <PolicySection title="6. Children's Privacy" titleZh="六、儿童隐私">
          <PolicyText>
            {`This app is suitable for all ages. Because we collect no personal information from
            anyone, including children, there is nothing to be collected or shared.`}
          </PolicyText>
        </PolicySection>

        <PolicySection title="7. Changes to This Policy" titleZh="七、政策变更">
          <PolicyText>
            {`If this policy ever changes, the updated version will appear in-app here and the
            effective date above will be revised.`}
          </PolicyText>
        </PolicySection>

        <PolicySection title="8. Contact" titleZh="八、联系我们">
          <PolicyText>
            {`Since we collect no data, there is nothing to request, access, or delete.
            For any questions about this policy, you may contact us through the app store listing.`}
          </PolicyText>
        </PolicySection>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 6,
  },
  updatedBadge: {
    borderRadius: theme.radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  updatedText: {
    fontSize: 12.5,
    lineHeight: 19,
    fontWeight: '600',
  },
  section: {
    marginBottom: 12,
    padding: 16,
  },
  sectionKicker: {
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  sectionBody: {
    gap: 8,
  },
  bodyText: {
    fontSize: 13.5,
    lineHeight: 21,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingRight: 4,
  },
  bulletDot: {
    fontSize: 13,
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 21,
  },
  footer: {
    height: 20,
  },
});

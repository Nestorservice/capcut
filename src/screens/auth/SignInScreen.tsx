import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthStackParamList } from '@types/navigation.types';
import { Button } from '@components/ui/Button';
import { Colors } from '@constants/colors';
import { Typography } from '@constants/typography';
import { Dim } from '@constants/dimensions';
import { useAuth } from '@hooks/useAuth';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

export function SignInScreen({ navigation }: Props) {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async () => {
    if (!email || !password) return;
    try {
      await signIn({ email: email.trim(), password });
    } catch {
      // useAuth surfaces a toast
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable hitSlop={10} onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={26} color="#ffffff" />
        </Pressable>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue your work.</Text>
        </View>

        <View style={styles.form}>
          <Field icon="mail" placeholder="Email" value={email} onChange={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Field
            icon="lock"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? 'visibility' : 'visibility-off'}
            onRightPress={() => setShowPassword(s => !s)}
          />
          <Text style={styles.forgot}>Forgot password?</Text>
        </View>

        <Button label="Sign in" variant="primary" size="lg" fullWidth loading={isLoading} onPress={onSubmit} />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button label="Continue with Google" variant="outline" size="lg" fullWidth icon="g-translate" onPress={() => undefined} />

        <Pressable onPress={() => navigation.replace('SignUp')} style={styles.footerLink}>
          <Text style={styles.footerText}>
            Don't have an account? <Text style={styles.footerHighlight}>Sign up</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface FieldProps {
  icon: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  rightIcon?: string;
  onRightPress?: () => void;
}

function Field({ icon, placeholder, value, onChange, secureTextEntry, keyboardType, autoCapitalize, rightIcon, onRightPress }: FieldProps) {
  return (
    <View style={styles.field}>
      <Icon name={icon} size={20} color={Colors.text.secondary} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.text.tertiary}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {rightIcon ? (
        <Pressable onPress={onRightPress} hitSlop={8}>
          <Icon name={rightIcon} size={20} color={Colors.text.secondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  content: { flexGrow: 1, padding: Dim.spacing.lg, paddingTop: 48 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: Dim.spacing.xl },
  header: { marginBottom: Dim.spacing.xxxl },
  title: { color: '#ffffff', fontSize: 32, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: Colors.text.secondary, fontSize: Typography.sizes.base },
  form: { gap: Dim.spacing.md, marginBottom: Dim.spacing.xl },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Dim.spacing.md,
    paddingVertical: Dim.spacing.md,
    backgroundColor: Colors.bg.input,
    borderRadius: Dim.radius.md,
    gap: 10,
  },
  input: { flex: 1, color: '#ffffff', fontSize: Typography.sizes.base },
  forgot: { color: Colors.accent.pink, fontSize: Typography.sizes.sm, fontWeight: '600', alignSelf: 'flex-end' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: Dim.spacing.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border.default },
  dividerText: { color: Colors.text.secondary, fontSize: Typography.sizes.sm },
  footerLink: { marginTop: Dim.spacing.xl, alignItems: 'center' },
  footerText: { color: Colors.text.secondary, fontSize: Typography.sizes.base },
  footerHighlight: { color: Colors.accent.pink, fontWeight: '700' },
});

/**
 * Security Event Logger
 * 
 * Centralized logging for security-related events in the authentication system
 * Logs events to console in development and can be extended to send to external services
 */

export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SESSION_REFRESHED = 'SESSION_REFRESHED',
  TOKEN_REFRESH_SUCCESS = 'TOKEN_REFRESH_SUCCESS',
  TOKEN_REFRESH_FAILURE = 'TOKEN_REFRESH_FAILURE',
  PASSWORD_CHANGE_SUCCESS = 'PASSWORD_CHANGE_SUCCESS',
  PASSWORD_CHANGE_FAILURE = 'PASSWORD_CHANGE_FAILURE',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS',
  UNAUTHORIZED_ACCESS_ATTEMPT = 'UNAUTHORIZED_ACCESS_ATTEMPT',
  INVALID_TOKEN = 'INVALID_TOKEN',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
}

export enum SecurityEventSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export interface SecurityEventData {
  type: SecurityEventType;
  severity: SecurityEventSeverity;
  message: string;
  userId?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

class SecurityLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isClient = typeof window !== 'undefined';

  /**
   * Log a security event
   */
  log(
    type: SecurityEventType,
    severity: SecurityEventSeverity,
    message: string,
    metadata?: Record<string, any>
  ): void {
    const eventData: SecurityEventData = {
      type,
      severity,
      message,
      timestamp: new Date().toISOString(),
      userAgent: this.isClient ? window.navigator.userAgent : undefined,
      metadata,
    };

    // Console logging
    this.logToConsole(eventData);

    // Send to external service (implement as needed)
    this.sendToService(eventData);
  }

  /**
   * Log to console with appropriate level
   */
  private logToConsole(eventData: SecurityEventData): void {
    const logMessage = `[SECURITY] [${eventData.severity}] ${eventData.type}: ${eventData.message}`;

    const logData = {
      ...eventData,
      environment: process.env.NODE_ENV,
    };

    switch (eventData.severity) {
      case SecurityEventSeverity.CRITICAL:
      case SecurityEventSeverity.ERROR:
        console.error(logMessage, logData);

        break;
      case SecurityEventSeverity.WARNING:
        console.warn(logMessage, logData);

        break;
      case SecurityEventSeverity.INFO:
      default:
        if (this.isDevelopment) {
          console.log(logMessage, logData);
        }

        break;
    }
  }

  /**
   * Send security event to external logging service
   * TODO: Implement integration with your logging service (e.g., Sentry, Datadog, LogRocket)
   */
  private sendToService(eventData: SecurityEventData): void {
    // Only send critical events in production to reduce noise
    const shouldSend = 
      !this.isDevelopment || 
      eventData.severity === SecurityEventSeverity.CRITICAL ||
      eventData.severity === SecurityEventSeverity.ERROR;

    if (!shouldSend) return;

    // Example implementations:
    
    // Sentry
    // if (typeof Sentry !== 'undefined') {
    //   Sentry.captureMessage(eventData.message, {
    //     level: eventData.severity.toLowerCase(),
    //     tags: {
    //       security_event: eventData.type,
    //     },
    //     extra: eventData.metadata,
    //   });
    // }

    // Custom API endpoint
    // fetch('/api/security-logs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(eventData),
    // }).catch(err => console.error('Failed to send security log:', err));

    // For now, just note that we would send to a service
    if (this.isDevelopment) {
      console.log('[SECURITY] Event ready for external logging:', eventData.type);
    }
  }

  /**
   * Convenience methods for common security events
   */

  logLoginSuccess(userId: string, email: string): void {
    this.log(
      SecurityEventType.LOGIN_SUCCESS,
      SecurityEventSeverity.INFO,
      `User logged in successfully`,
      { userId, email }
    );
  }

  logLoginFailure(email: string, reason: string): void {
    this.log(
      SecurityEventType.LOGIN_FAILURE,
      SecurityEventSeverity.WARNING,
      `Login failed: ${reason}`,
      { email, reason }
    );
  }

  logLogout(userId: string): void {
    this.log(
      SecurityEventType.LOGOUT,
      SecurityEventSeverity.INFO,
      `User logged out`,
      { userId }
    );
  }

  logSessionExpired(userId?: string): void {
    this.log(
      SecurityEventType.SESSION_EXPIRED,
      SecurityEventSeverity.WARNING,
      `Session expired`,
      { userId }
    );
  }

  logSessionRefreshed(userId: string): void {
    this.log(
      SecurityEventType.SESSION_REFRESHED,
      SecurityEventSeverity.INFO,
      `Session refreshed successfully`,
      { userId }
    );
  }

  logTokenRefreshSuccess(userId: string): void {
    this.log(
      SecurityEventType.TOKEN_REFRESH_SUCCESS,
      SecurityEventSeverity.INFO,
      `Token refreshed successfully`,
      { userId }
    );
  }

  logTokenRefreshFailure(reason: string): void {
    this.log(
      SecurityEventType.TOKEN_REFRESH_FAILURE,
      SecurityEventSeverity.ERROR,
      `Token refresh failed: ${reason}`,
      { reason }
    );
  }

  logPasswordChange(userId: string, success: boolean): void {
    this.log(
      success ? SecurityEventType.PASSWORD_CHANGE_SUCCESS : SecurityEventType.PASSWORD_CHANGE_FAILURE,
      success ? SecurityEventSeverity.INFO : SecurityEventSeverity.WARNING,
      success ? `Password changed successfully` : `Password change failed`,
      { userId }
    );
  }

  logPasswordResetRequest(email: string): void {
    this.log(
      SecurityEventType.PASSWORD_RESET_REQUEST,
      SecurityEventSeverity.INFO,
      `Password reset requested`,
      { email }
    );
  }

  logUnauthorizedAccess(path: string, userId?: string): void {
    this.log(
      SecurityEventType.UNAUTHORIZED_ACCESS_ATTEMPT,
      SecurityEventSeverity.WARNING,
      `Unauthorized access attempt to: ${path}`,
      { path, userId }
    );
  }

  logInvalidToken(reason: string): void {
    this.log(
      SecurityEventType.INVALID_TOKEN,
      SecurityEventSeverity.ERROR,
      `Invalid token detected: ${reason}`,
      { reason }
    );
  }

  logSuspiciousActivity(description: string, metadata?: Record<string, any>): void {
    this.log(
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      SecurityEventSeverity.CRITICAL,
      description,
      metadata
    );
  }
}

// Export singleton instance
export const securityLogger = new SecurityLogger();

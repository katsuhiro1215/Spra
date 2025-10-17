<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;

class AdminResetPassword extends Notification
{
  use Queueable;

  /**
   * The password reset token.
   */
  public string $token;

  /**
   * The callback that should be used to create the reset password URL.
   */
  public static $createUrlCallback;

  /**
   * The callback that should be used to build the mail message.
   */
  public static $toMailCallback;

  /**
   * Create a new notification instance.
   */
  public function __construct(string $token)
  {
    $this->token = $token;
  }

  /**
   * Get the notification's delivery channels.
   *
   * @return array<int, string>
   */
  public function via(object $notifiable): array
  {
    return ['mail'];
  }

  /**
   * Get the mail representation of the notification.
   */
  public function toMail(object $notifiable): MailMessage
  {
    if (static::$toMailCallback) {
      return call_user_func(static::$toMailCallback, $notifiable, $this->token);
    }

    return $this->buildMailMessage($this->resetUrl($notifiable));
  }

  /**
   * Get the reset password notification mail message for the given URL.
   */
  protected function buildMailMessage(string $url): MailMessage
  {
    return (new MailMessage)
      ->subject(__('passwords.reset_subject'))
      ->line(__('passwords.reset_intro'))
      ->action(__('passwords.reset_action'), $url)
      ->line(__('passwords.reset_expiry', ['count' => config('auth.passwords.' . config('auth.defaults.passwords') . '.expire')]))
      ->line(__('passwords.reset_ignore'));
  }

  /**
   * Get the reset URL for the given notifiable.
   */
  protected function resetUrl(object $notifiable): string
  {
    if (static::$createUrlCallback) {
      return call_user_func(static::$createUrlCallback, $notifiable, $this->token);
    }

    return url(route('admin.password.reset', [
      'token' => $this->token,
      'email' => $notifiable->getEmailForPasswordReset(),
    ], false));
  }

  /**
   * Set a callback that should be used when creating the reset password button URL.
   */
  public static function createUrlUsing(?callable $callback): void
  {
    static::$createUrlCallback = $callback;
  }

  /**
   * Set a callback that should be used when building the notification mail message.
   */
  public static function toMailUsing(?callable $callback): void
  {
    static::$toMailCallback = $callback;
  }
}

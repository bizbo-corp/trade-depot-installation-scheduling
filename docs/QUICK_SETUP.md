# Quick Setup Guide - Installation Scheduling System

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies

Dependencies are already installed! The system uses:

- ✅ `resend` - Email service
- ✅ `react-calendly` - Booking widget
- ✅ `react-icons` - Icons

### 2. Configure Environment Variables

You need to add two environment variables to your `.env.local` file:

```bash
# Get your Resend API key from: https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Get your Calendly link from your Calendly event page
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/michael-bizbo/installation
```

**Important:** The system won't work without these variables!

### 3. Test the System

#### Test Admin Panel

```
http://localhost:3000?mode=admin
```

Fill in:

- Order ID: `TEST-001`
- Customer Email: `your-email@example.com`
- Customer Name: `Test Customer`

Try both email types!

#### Test Customer Booking Flow

```
http://localhost:3000?mode=booking&orderId=TEST-001
```

Follow the 4-step process:

1. ✅ Confirm delivery received
2. 📝 Enter customer details
3. 📅 Schedule via Calendly
4. 🎉 See success message

### 4. Verify Emails

Check your inbox for:

- Post-purchase email (if sent from admin)
- Delivery & booking email (if sent from admin)
- Installer notification at `michael@bizbo.co.nz` (after Calendly booking)

## 📋 Pre-Flight Checklist

Before going live:

- [ ] Resend API key added to `.env.local`
- [ ] Calendly URL added to `.env.local`
- [ ] Tested admin panel
- [ ] Tested customer booking flow
- [ ] Received all 3 email types
- [ ] Verified Calendly integration works
- [ ] Updated email sender domain (if needed)
- [ ] Replaced placeholder header images (optional)

## 🔧 Common Issues

### "Failed to send email"

- Check `RESEND_API_KEY` is set correctly
- Verify Resend account is active
- Check browser console for detailed error

### Calendly widget not loading

- Verify `NEXT_PUBLIC_CALENDLY_URL` is correct
- Ensure URL is publicly accessible
- Check Calendly account is active

### Overlay not appearing

- Ensure URL has `?mode=admin` or `?mode=booking&orderId=XXX`
- Check browser console for errors
- Verify component is imported in `app/page.tsx`

## 📚 Full Documentation

For detailed information, see:

- [Full Documentation](./INSTALLATION_SCHEDULING.md)
- API details
- Email templates
- Troubleshooting guide
- Production deployment

## 🎯 Next Steps

1. **Customize Email Templates**: Edit `app/api/send-email/route.ts`
2. **Update Header Images**: Replace placeholder images with your brand
3. **Configure Calendly**: Set up custom questions in Calendly
4. **Test Production**: Deploy and test with real data

## 💡 Tips

- Use browser DevTools Network tab to debug API calls
- Check Resend dashboard for email delivery logs
- Test with different email providers (Gmail, Outlook, etc.)
- Verify mobile responsiveness

## 🆘 Need Help?

1. Check browser console for errors
2. Review API responses in Network tab
3. Check Resend dashboard for email logs
4. Review Calendly event logs
5. See full documentation for troubleshooting

---

**Ready to go?** Just add your environment variables and start testing! 🚀

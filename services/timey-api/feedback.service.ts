import { environment } from '../../environments'
import { Feedback } from '../../models'

/* istanbul ignore next */
class FeedbackService {
  feedbackUrl = environment.apiUrl + '/feedback'

  public async add(feedback: Feedback) {
    await fetch(this.feedbackUrl + '/add', { method: 'POST', body: JSON.stringify(feedback) })
  }
}
export const feedbackService = new FeedbackService()

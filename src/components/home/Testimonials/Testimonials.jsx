import React from 'react';

const Testimonials = () => {
  const reviews = [
    {
      name: 'Dr. Sarah Jenkins',
      role: 'Dean, Oxford Academy',
      image: 'https://i.pravatar.cc/150?u=sarah',
      comment:
        "The AI eye-tracking feature is a game-changer. We've seen a 40% reduction in academic dishonesty since switching to EXAMINERLY.",
      rating: 5,
    },
    {
      name: 'Marcus Thorne',
      role: 'E-Learning Specialist',
      image: 'https://i.pravatar.cc/150?u=marcus',
      comment:
        'Seamless integration with our existing LMS. The instant report generation saves our faculty hundreds of hours every semester.',
      rating: 5,
    },
    {
      name: 'Elena Rodriguez',
      role: 'Online Instructor',
      image: 'https://i.pravatar.cc/150?u=elena',
      comment:
        "The most intuitive interface I've ever used. Even my less tech-savvy students find it incredibly easy to navigate.",
      rating: 4,
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-base-100 overflow-hidden">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-10 lg:px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[11px] px-4 py-1.5 bg-primary/10 rounded-full">
              Reviews
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-base-content tracking-tighter leading-tight">
              Trusted by <br />{' '}
              <span className="text-primary italic">Global</span> Educators
            </h2>
          </div>
          <p className="text-base-content/50 font-bold max-w-sm">
            Don&apos;t just take our word for it. Join thousands of satisfied
            institutions worldwide.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="group bg-base-200/30 p-10 rounded-3xl border border-transparent hover:border-primary/20 hover:bg-base-200/50 transition-all duration-500 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-10 text-6xl font-serif text-primary/10 group-hover:text-primary/20 transition-colors">
                “
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-base-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-1.203 1.516-1.902 0l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.699 1.516-2.202.921-1.902 0l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Comment */}
              <p className="text-base-content/70 font-medium leading-relaxed mb-8 italic">
                &quotl;{review.comment}&quot;
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-base-100 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-black text-base-content leading-tight">
                    {review.name}
                  </h4>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mt-1">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
